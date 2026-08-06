import Lecture from "../model/lectureModel.js"
import Course from "../model/courseModel.js"

const buildAudioUrl = (videoUrl) => {
    
  const lastDot = videoUrl.lastIndexOf(".")
 if (lastDot === -1) return videoUrl + ".mp3"
    return videoUrl.slice(0, lastDot) + ".mp3"
}

export const generateTranscript = async (req, res) => {
    try {
   const { lectureId } = req.params
      const lecture = await Lecture.findById(lectureId)
  if (!lecture) return res.status(404).json({ message: "Lecture not found" })

        if (lecture.transcript) {
            return res.status(200).json({ transcript: lecture.transcript })
        }

  const audioUrl = buildAudioUrl(lecture.videoUrl)
      const audioFetch = await fetch(audioUrl)
        if (!audioFetch.ok) {
            return res.status(502).json({ message: "Could not extract audio from this lecture's video" })
        }
    const audioBuffer = await audioFetch.arrayBuffer()
        const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" })

           const formData = new FormData()
        formData.append("file", audioBlob, "lecture.mp3")
        formData.append("model", "whisper-large-v3-turbo")
        formData.append("response_format", "text")

  const groqResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
            body: formData
        })

  if (!groqResponse.ok) {
            const errText = await groqResponse.text()
            console.log("Groq transcription error:", errText)
            return res.status(502).json({ message: "Transcript generation failed" })
        }

      const transcriptText = await groqResponse.text()
        lecture.transcript = transcriptText.trim()
        await lecture.save()

           return res.status(200).json({ transcript: lecture.transcript })
    } catch (error) {
            return res.status(500).json({ message: `generateTranscript error ${error}` })
    }
}
const extractQuizJSON = (rawText) => {
    const cleaned = rawText.replace(/```json|```/g, "").trim()
    return JSON.parse(cleaned)
}

const callGroqForQuiz = async (contentText, questionCount) => {
    const systemPrompt = `You are a quiz-generation assistant for an online learning platform.
Given lecture/course content, generate a multiple-choice quiz.
Return ONLY valid JSON (no markdown fences, no preamble) in this exact shape:
{"questions":[{"question":"<text>","options":["A","B","C","D"],"correctIndex":0}]}
Rules:
- Generate exactly ${questionCount} questions.
- Each question must have exactly 4 options.
- correctIndex is the 0-based index of the correct option.
- Base questions strictly on the given content — don't invent facts not implied by it.
- Vary difficulty from recall to conceptual understanding.`

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: contentText.slice(0, 12000) }
            ],
            temperature: 0.4,
            max_completion_tokens: 2048
        })
    })

    if (!groqResponse.ok) {
        const errText = await groqResponse.text()
        console.log("Groq quiz error:", errText)
        throw new Error("Quiz generation failed")
    }

    const groqData = await groqResponse.json()
    const rawText = groqData?.choices?.[0]?.message?.content || "{}"
    return extractQuizJSON(rawText)
}

export const generateLectureQuiz = async (req, res) => {
    try {
        const { lectureId } = req.params
        const lecture = await Lecture.findById(lectureId)
        if (!lecture) return res.status(404).json({ message: "Lecture not found" })

        const content = lecture.transcript?.trim()
            ? lecture.transcript
            : `Lecture title: ${lecture.title}`

        const quiz = await callGroqForQuiz(content, 5)
        return res.status(200).json(quiz)
    } catch (error) {
        return res.status(500).json({ message: `generateLectureQuiz error ${error}` })
    }
}

export const generateCourseQuiz = async (req, res) => {
    try {
        const { courseId } = req.params
        const course = await Course.findById(courseId).populate("lectures")
        if (!course) return res.status(404).json({ message: "Course not found" })

        if (course.lectures.length === 0) {
            return res.status(400).json({ message: "This course has no lectures yet" })
        }

        const combinedContent = course.lectures
            .map((lec, i) => {
                const body = lec.transcript?.trim() ? lec.transcript : `(no transcript) ${lec.title}`
                return `Lecture ${i + 1}: ${lec.title}\n${body}`
            })
            .join("\n\n")

        const fullContent = `Course: ${course.title}\n${course.description || ""}\n\n${combinedContent}`

        const quiz = await callGroqForQuiz(fullContent, 10)
        return res.status(200).json(quiz)
    } catch (error) {
        return res.status(500).json({ message: `generateCourseQuiz error ${error}` })
    }
}
export const mockInterviewReply = async (req, res) => {
    try {
     const { role, history } = req.body
        if (!role || !role.trim()) {
           return res.status(400).json({ message: "Role is required" })
        }

        const systemPrompt = `You are conducting a mock job interview for the role of "${role}".
Act like a real, professional but friendly interviewer.
Rules:
- Ask exactly ONE question at a time. Never ask multiple questions in one message.
- Start with a brief greeting and your first question if this is the beginning of the conversation.
- Base follow-up questions on the candidate's previous answers where relevant — mix technical, behavioral, and situational questions appropriate for "${role}".
- Keep your messages concise (2-4 sentences max), like a real interviewer, not an essay.
- Do not reveal this is an AI evaluation process. Stay in character as the interviewer.
- Do not give the candidate feedback or scores during the interview itself — that happens separately at the end.`

        const messages = [
      { role: "system", content: systemPrompt },
            ...(history || []).map((m) => ({ role: m.role, content: m.content }))
        ]

      
        if (!history || history.length === 0) {
     messages.push({ role: "user", content: "Please begin the interview." })
        }

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
         method: "POST",
            headers: {
                "Content-Type": "application/json",
             "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
            model: "openai/gpt-oss-20b",
                messages,
              temperature: 0.6,
                max_completion_tokens: 400
            })
        })

        if (!groqResponse.ok) {
         const errText = await groqResponse.text()
           console.log("Groq mock interview error:", errText)
       return res.status(502).json({ message: "Interview agent is temporarily unavailable" })
        }

        const groqData = await groqResponse.json()
     const reply = groqData?.choices?.[0]?.message?.content || ""

          return res.status(200).json({ reply })
    } catch (error) {
    return res.status(500).json({ message: `mockInterviewReply error ${error}` })
    }
}

export const mockInterviewFeedback = async (req, res) => {
    try {
     const { role, history } = req.body
        if (!role || !history || history.length === 0) {
         return res.status(400).json({ message: "Interview role and transcript are required" })
        }

          const transcriptText = history
            .map((m) => `${m.role === "assistant" ? "Interviewer" : "Candidate"}: ${m.content}`)
            .join("\n")

    const systemPrompt = `You are an expert hiring evaluator reviewing a completed mock interview transcript for the role of "${role}".
Return ONLY valid JSON (no markdown fences, no preamble) in this exact shape:
{"score": <0-10 integer>, "strengths": ["...", "..."], "improvements": ["...", "..."], "summary": "<2-3 sentence overall assessment>"}
Rules:
- Base everything strictly on the transcript given.
- strengths and improvements should each have 2-4 short, specific bullet points.
- Be honest and constructive, not just positive.`

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
         headers: {
                "Content-Type": "application/json",
             "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b",
             messages: [
                    { role: "system", content: systemPrompt },
                 { role: "user", content: transcriptText }
                ],
                temperature: 0.3,
                max_completion_tokens: 800
            })
        })

        if (!groqResponse.ok) {
         const errText = await groqResponse.text()
          console.log("Groq feedback error:", errText)
      return res.status(502).json({ message: "Feedback generation failed" })
        }

        const groqData = await groqResponse.json()
         const rawText = groqData?.choices?.[0]?.message?.content || "{}"
    const cleaned = rawText.replace(/```json|```/g, "").trim()
        const feedback = JSON.parse(cleaned)

        return res.status(200).json(feedback)
    } catch (error) {
        return res.status(500).json({ message: `mockInterviewFeedback error ${error}` })
    }
}