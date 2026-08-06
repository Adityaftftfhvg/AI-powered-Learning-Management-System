import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { serverUrl } from '../App'
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa'
import { FaMicrophone } from 'react-icons/fa'
const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
    "Data Scientist",
  "DevOps Engineer",
  "Product Manager",
  "UI/UX Designer",
  "QA Engineer"
]

function MockInterview() {
  const navigate = useNavigate()
  const [role, setRole] = useState(null)
  const [messages, setMessages] = useState([]) // { role: 'user'|'assistant', content }
    const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
   const [starting, setStarting] = useState(false)
   const [voiceMode, setVoiceMode] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)
  const [feedback, setFeedback] = useState(null)
      const [feedbackLoading, setFeedbackLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])
  const speak = (text) => {
    if (!voiceMode || !window.speechSynthesis) return
    window.speechSynthesis.cancel() // stop any overlapping speech
      const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 1
    utterance.pitch = 1
   window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    const last = messages[messages.length - 1]
    if (last?.role === "assistant") speak(last.content)
   
  }, [messages, voiceMode])
  const startInterview = async (selectedRole) => {
       setRole(selectedRole)
    setStarting(true)
    try {
      const result = await axios.post(
   serverUrl + "/api/ai/mock-interview/reply",
        { role: selectedRole, history: [] },
        { withCredentials: true }
      )
      setMessages([{ role: "assistant", content: result.data.reply }])
    } catch (error) {
      console.log(error)
         toast.error(error?.response?.data?.message || "Failed to start interview")
      setRole(null)
    } finally {
      setStarting(false)
    }
  }

  const sendMessage = async () => {
       const text = input.trim()
    if (!text || sending) return

    const updatedHistory = [...messages, { role: "user", content: text }]
       setMessages(updatedHistory)
    setInput("")
     setSending(true)

    try {
      const result = await axios.post(
        serverUrl + "/api/ai/mock-interview/reply",
           { role, history: updatedHistory },
        { withCredentials: true }
      )
      setMessages([...updatedHistory, { role: "assistant", content: result.data.reply }])
    } catch (error) {
        console.log(error)
  toast.error(error?.response?.data?.message || "Failed to get a response")
    } finally {
      setSending(false)
    }
  }
   const handleMicInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error("Voice input isn't supported in this browser")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognitionRef.current = recognition

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
    }

    recognition.start()
  }
  const endInterview = async () => {
        setFeedbackLoading(true)
    try {
      const result = await axios.post(
        serverUrl + "/api/ai/mock-interview/feedback",
           { role, history: messages },
        { withCredentials: true }
      )
            setFeedback(result.data)
    } catch (error) {
          console.log(error)
     toast.error(error?.response?.data?.message || "Failed to generate feedback")
    } finally {
        setFeedbackLoading(false)
    }
  }

  const resetAll = () => {
    setRole(null)
        setMessages([])
    setFeedback(null)
    setInput("")
  }

  
  if (!role) {
    return (
      <div className='min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center'>
        <div className='w-full max-w-[560px] bg-white rounded-2xl shadow p-6 sm:p-8'>
   <FaArrowLeft className='w-[18px] h-[18px] cursor-pointer mb-4' onClick={() => navigate(-1)} />
           <h1 className='text-xl sm:text-2xl font-bold mb-2'>AI Mock Interview</h1>
          <p className='text-sm text-gray-500 mb-6'>Pick a role to start a short, realistic practice interview.</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            {ROLES.map((r) => (
              <button
               key={r}
                onClick={() => startInterview(r)}
                disabled={starting}
                  className='text-left px-4 py-3 rounded-[12px] border-2 border-gray-200 hover:border-[#03394b] hover:bg-[#03394b0d] transition-colors text-sm font-medium disabled:opacity-50'
              >
                {r}
              </button>
            ))}
          </div>
      {starting && <p className='text-center text-gray-400 text-sm mt-5'>Preparing interviewer…</p>}
        </div>
      </div>
    )
  }

 
  if (feedback) {
    return (
      <div className='min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center'>
           <div className='w-full max-w-[560px] bg-white rounded-2xl shadow p-6 sm:p-8'>
          <h1 className='text-xl sm:text-2xl font-bold mb-1'>Interview Feedback</h1>
     <p className='text-xs text-gray-400 mb-5'>{role}</p>

       <div className='flex items-center gap-4 mb-6'>
            <div className='w-16 h-16 rounded-full bg-[#03394b] text-white flex items-center justify-center text-xl font-bold shrink-0'>
                 {feedback.score}/10
            </div>
      <p className='text-sm text-gray-600 leading-relaxed'>{feedback.summary}</p>
          </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            <div>
              <h3 className='font-semibold text-sm text-green-700 mb-2'>Strengths</h3>
           <ul className='list-disc list-inside space-y-1 text-sm text-gray-600'>
                {feedback.strengths?.map((s, i) => <li key={i}>{s}</li>)}
       </ul>
            </div>
            <div>
              <h3 className='font-semibold text-sm text-rose-600 mb-2'>Areas to improve</h3>
              <ul className='list-disc list-inside space-y-1 text-sm text-gray-600'>
              {feedback.improvements?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>

     <div className='flex flex-wrap gap-3 mt-7'>
            <button onClick={resetAll} className='px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium'>
       Try Another Role
          </button>
            <button onClick={() => navigate('/')} className='px-5 py-2.5 rounded-full border-2 border-gray-300 text-sm font-medium'>
              Back to Home
            </button>
          </div>
            </div>
      </div>
    )
  }

  
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
  <div className='px-4 md:px-8 py-4 bg-white border-b flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <FaArrowLeft className='w-[16px] h-[16px] cursor-pointer shrink-0' onClick={resetAll} />
          <div>
     <h1 className='text-sm sm:text-base font-semibold'>{role} — Mock Interview</h1>
            <p className='text-xs text-gray-400'>AI Interviewer</p>
             </div>
        </div>
      <div className='flex items-center gap-3'>
          <label className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 cursor-pointer select-none'>
            <input
              type="checkbox"
              checked={voiceMode}
        onChange={(e) => {
           setVoiceMode(e.target.checked)
                if (!e.target.checked) window.speechSynthesis?.cancel()
              }}
            />
            Voice Mode
   </label>
          <button
       onClick={endInterview}
              disabled={feedbackLoading || messages.length < 2}
            className='px-4 py-2 rounded-full bg-[#03394b] text-white text-xs sm:text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed'
          >
            {feedbackLoading ? "Scoring…" : "End"}
          </button>
     </div>
      </div>
           <div ref={scrollRef} className='flex-1 overflow-y-auto px-4 md:px-0 py-6'>
        <div className='max-w-[700px] mx-auto flex flex-col gap-4'>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
           className={`max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-[16px] text-[13px] sm:text-[14px] leading-relaxed ${
                  m.role === "user"
               ? "bg-[#03394b] text-white rounded-br-[4px]"
                    : "bg-white text-gray-800 shadow-sm rounded-bl-[4px]"
                }`}
              >
                {m.content}
              </div>
                </div>
          ))}
          {sending && (
          <div className='flex justify-start'>
              <div className='bg-white px-4 py-2.5 rounded-[16px] rounded-bl-[4px] shadow-sm text-gray-400 text-[13px]'>
                Interviewer is typing…
              </div>
            </div>
          )}
        </div>
      </div>

          <div className='bg-white border-t px-4 md:px-0 py-3 sm:py-4'>
        <div className='max-w-[700px] mx-auto flex items-center gap-2'>
         <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={listening ? "Listening…" : "Type your answer…"}
            disabled={sending}
            className='flex-1 border-2 border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#03394b] disabled:opacity-50'
          />
          {voiceMode && (
            <button
              onClick={handleMicInput}
          disabled={sending}
                  className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full flex items-center justify-center transition-colors disabled:opacity-40 ${
                listening ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-[#03394b]"
              }`}
            >
         <FaMicrophone size={16} />
            </button>
          )}
          <button
       onClick={sendMessage}
            disabled={sending || !input.trim()}
            className='w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full bg-[#03394b] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed'
          >
            <FaPaperPlane size={14} />
          </button>
      </div>
       </div>
    </div>
  )
}

export default MockInterview