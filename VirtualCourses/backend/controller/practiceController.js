import PracticeAttempt from "../model/practiceAttemptModel.js"
import { recordActivity } from "../utils/gamification.js"

const PRACTICE_SOLVE_XP = 15

const extractJSON = (rawText) => {
    const cleaned = rawText.replace(/```json|```/g, "").trim()
    return JSON.parse(cleaned)
}

const callGroqChat = async ({ systemPrompt, userContent, temperature = 0.5, maxTokens = 1200 }) => {
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
                { role: "user", content: userContent }
            ],
            temperature,
            max_completion_tokens: maxTokens
        })
    })

    if (!groqResponse.ok) {
        const errText = await groqResponse.text()
        console.log("Groq practice error:", errText)
        throw new Error("AI request failed")
    }

    const groqData = await groqResponse.json()
    return groqData?.choices?.[0]?.message?.content || "{}"
}

export const generateProblem = async (req, res) => {
    try {
        const { topic, difficulty } = req.body
        if (!topic || !difficulty) {
            return res.status(400).json({ message: "topic and difficulty are required" })
        }

        const systemPrompt = `You are a coding-interview question generator for a placement-prep platform.
Generate ONE original coding practice problem on the topic "${topic}" at "${difficulty}" difficulty,
in the style of a real technical interview question (like LeetCode/HackerRank).
Return ONLY valid JSON (no markdown fences, no preamble) in this exact shape:
{
  "title": "<short problem title>",
  "difficulty": "${difficulty}",
  "topic": "${topic}",
  "description": "<clear problem statement, 3-6 sentences>",
  "examples": [{"input": "<example input>", "output": "<expected output>", "explanation": "<short explanation>"}],
  "constraints": ["<constraint 1>", "<constraint 2>"],
  "hints": ["<hint 1>", "<hint 2>"]
}
Provide exactly 1-2 examples and 2-3 hints, ordered from a gentle nudge to a stronger hint.`

        const rawText = await callGroqChat({
            systemPrompt,
            userContent: `Generate a ${difficulty} problem about ${topic}.`,
            temperature: 0.7
        })

        const problem = extractJSON(rawText)
        return res.status(200).json(problem)
    } catch (error) {
        return res.status(500).json({ message: `generateProblem error ${error}` })
    }
}

export const submitSolution = async (req, res) => {
    try {
        const userId = req.userId
        const { problem, code, language } = req.body
        if (!problem?.title || !code?.trim()) {
            return res.status(400).json({ message: "problem and code are required" })
        }

        const systemPrompt = `You are an expert technical interviewer reviewing a candidate's code solution.
Problem: "${problem.title}"
Description: ${problem.description}

Evaluate the candidate's ${language || "code"} solution below for correctness, time/space complexity, and code quality.
Return ONLY valid JSON (no markdown fences, no preamble) in this exact shape:
{
  "verdict": "Correct" | "Partially Correct" | "Incorrect",
  "score": <0-10 integer>,
  "timeComplexity": "<e.g. O(n)>",
  "spaceComplexity": "<e.g. O(1)>",
  "feedback": "<3-5 sentence constructive feedback>",
  "improvements": ["<short suggestion>", "<short suggestion>"]
}
Be honest — if the logic is flawed or doesn't handle edge cases, say so clearly and reflect it in the score.`

        const rawText = await callGroqChat({
            systemPrompt,
            userContent: `Language: ${language || "javascript"}\n\nCandidate's code:\n${code}`,
            temperature: 0.3,
            maxTokens: 900
        })

        const evaluation = extractJSON(rawText)

        await PracticeAttempt.create({
            user: userId,
            topic: problem.topic || "General",
            difficulty: problem.difficulty || "Medium",
            problemTitle: problem.title,
            verdict: evaluation.verdict || "Incorrect",
            score: evaluation.score || 0,
            language: language || "javascript"
        })

        if (evaluation.verdict === "Correct") {
            const user = await recordActivity(userId, PRACTICE_SOLVE_XP)
            if (user) {
                user.solvedProblems = (user.solvedProblems || 0) + 1
                await user.save()
            }
        }

        return res.status(200).json(evaluation)
    } catch (error) {
        return res.status(500).json({ message: `submitSolution error ${error}` })
    }
}

export const getMyPracticeHistory = async (req, res) => {
    try {
        const userId = req.userId
        const attempts = await PracticeAttempt.find({ user: userId }).sort({ createdAt: -1 }).limit(50)
        return res.status(200).json(attempts)
    } catch (error) {
        return res.status(500).json({ message: `getMyPracticeHistory error ${error}` })
    }
}