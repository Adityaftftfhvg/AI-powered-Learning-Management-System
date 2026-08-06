import { recordActivity } from "../utils/gamification.js"

const extractJSON = (rawText) => {
    const cleaned = rawText.replace(/```json|```/g, "").trim()
    return JSON.parse(cleaned)
}

const REVIEW_XP = 10

export const reviewResume = async (req, res) => {
    try {
        const userId = req.userId
        const { resumeText, targetRole } = req.body
        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({ message: "Please paste your full resume text (at least 50 characters)" })
        }

        const systemPrompt = `You are an experienced technical recruiter and ATS (Applicant Tracking System) expert
reviewing a candidate's resume for a "${targetRole || "Software Engineer"}" role at a campus placement drive.
Return ONLY valid JSON (no markdown fences, no preamble) in this exact shape:
{
  "atsScore": <0-100 integer>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<point>", "<point>"],
  "weaknesses": ["<point>", "<point>"],
  "missingKeywords": ["<keyword>", "<keyword>"],
  "formattingIssues": ["<issue>", "<issue>"],
  "suggestions": ["<actionable suggestion>", "<actionable suggestion>"]
}
Rules:
- atsScore reflects how well this resume would pass an automated ATS filter and impress a recruiter for the target role.
- missingKeywords should be specific skills/technologies commonly expected for this role that are absent from the resume.
- Be specific and actionable, not generic. Base everything strictly on the resume text given.`

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
                    { role: "user", content: resumeText.slice(0, 12000) }
                ],
                temperature: 0.3,
                max_completion_tokens: 1200
            })
        })

        if (!groqResponse.ok) {
            const errText = await groqResponse.text()
            console.log("Groq resume review error:", errText)
            return res.status(502).json({ message: "Resume review failed, please try again" })
        }

        const groqData = await groqResponse.json()
        const rawText = groqData?.choices?.[0]?.message?.content || "{}"
        const review = extractJSON(rawText)

        await recordActivity(userId, REVIEW_XP)

        return res.status(200).json(review)
    } catch (error) {
        return res.status(500).json({ message: `reviewResume error ${error}` })
    }
}