import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { serverUrl } from '../App'
import { FaArrowLeft } from 'react-icons/fa'

const TOPICS = ["Arrays", "Strings", "Linked List", "Trees", "Graphs", "Dynamic Programming", "Recursion", "Sorting", "SQL", "System Design Basics"]
const DIFFICULTIES = ["Easy", "Medium", "Hard"]

function Practice() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState(TOPICS[0])
  const [difficulty, setDifficulty] = useState("Easy")
  const [problem, setProblem] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [evaluation, setEvaluation] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [history, setHistory] = useState([])

  const fetchHistory = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/practice/history", { withCredentials: true })
      setHistory(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { fetchHistory() }, [])

  const generateProblem = async () => {
    setGenerating(true)
    setProblem(null)
    setEvaluation(null)
    setCode("")
    try {
      const result = await axios.post(
        serverUrl + "/api/practice/generate",
        { topic, difficulty },
        { withCredentials: true }
      )
      setProblem(result.data)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Failed to generate a problem")
    } finally {
      setGenerating(false)
    }
  }

  const submitSolution = async () => {
    if (!code.trim()) {
      toast.error("Write some code before submitting")
      return
    }
    setSubmitting(true)
    try {
      const result = await axios.post(
        serverUrl + "/api/practice/submit",
        { problem, code, language },
        { withCredentials: true }
      )
      setEvaluation(result.data)
      fetchHistory()
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Failed to evaluate solution")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='px-4 md:px-8 py-4 bg-white border-b flex items-center justify-between'>
        <button
          className='text-sm text-gray-600 hover:text-black flex items-center gap-1'
          onClick={() => navigate("/mylearning")}
        >
          <FaArrowLeft /> Practice Problems
        </button>
      </div>

      <div className='max-w-5xl mx-auto p-4 md:p-8 grid lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-4'>
          <div className='bg-white rounded-lg shadow p-5 flex flex-wrap items-end gap-3'>
            <div>
              <label className='text-xs text-gray-500 block mb-1'>Topic</label>
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className='border rounded px-3 py-2 text-sm'>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className='text-xs text-gray-500 block mb-1'>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className='border rounded px-3 py-2 text-sm'>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <button
              onClick={generateProblem}
              disabled={generating}
              className='px-5 py-2 rounded-full bg-[#03394b] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50'
            >
              {generating ? "Generating…" : "Generate Problem"}
            </button>
          </div>

          {problem && (
            <div className='bg-white rounded-lg shadow p-5'>
              <h2 className='font-semibold mb-1'>{problem.title}</h2>
              <p className='text-xs text-gray-400 mb-3'>{problem.topic} · {problem.difficulty}</p>
              <p className='text-sm text-gray-700 mb-4 whitespace-pre-wrap'>{problem.description}</p>

              {problem.examples?.map((ex, i) => (
                <div key={i} className='text-xs bg-gray-50 rounded p-3 mb-2 font-mono'>
                  <p><b>Input:</b> {ex.input}</p>
                  <p><b>Output:</b> {ex.output}</p>
                  {ex.explanation && <p className='text-gray-400 mt-1 font-sans'>{ex.explanation}</p>}
                </div>
              ))}

              {problem.constraints?.length > 0 && (
                <div className='text-xs text-gray-500 mb-4'>
                  <b>Constraints:</b>
                  <ul className='list-disc pl-5'>
                    {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className='border rounded px-3 py-2 text-sm mb-2'
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder='Write your solution here...'
                className='w-full h-56 border rounded p-3 text-sm font-mono'
              />
              <button
                onClick={submitSolution}
                disabled={submitting}
                className='mt-3 px-5 py-2 rounded-full bg-[#03394b] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50'
              >
                {submitting ? "Evaluating…" : "Submit Solution"}
              </button>

              {evaluation && (
                <div className='mt-5 border-t pt-4'>
                  <p className={`font-semibold ${evaluation.verdict === "Correct" ? "text-green-600" : evaluation.verdict === "Partially Correct" ? "text-yellow-600" : "text-red-600"}`}>
                    {evaluation.verdict} · Score: {evaluation.score}/10
                  </p>
                  <p className='text-xs text-gray-400 mt-1'>Time: {evaluation.timeComplexity} · Space: {evaluation.spaceComplexity}</p>
                  <p className='text-sm text-gray-700 mt-2'>{evaluation.feedback}</p>
                  {evaluation.improvements?.length > 0 && (
                    <ul className='list-disc pl-5 text-sm text-gray-600 mt-2'>
                      {evaluation.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className='bg-white rounded-lg shadow p-5 h-fit'>
          <h2 className='font-semibold text-sm mb-3'>Recent Attempts</h2>
          {history.length === 0 ? (
            <p className='text-xs text-gray-400'>No attempts yet.</p>
          ) : (
            <div className='space-y-3 max-h-[500px] overflow-y-auto'>
              {history.map((h) => (
                <div key={h._id} className='text-xs border-b pb-2'>
                  <p className='font-medium'>{h.problemTitle}</p>
                  <p className='text-gray-400'>{h.topic} · {h.difficulty} · {h.verdict}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Practice