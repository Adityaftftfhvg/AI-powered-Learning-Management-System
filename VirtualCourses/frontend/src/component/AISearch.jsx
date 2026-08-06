import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { serverUrl } from '../App'
import ai from "../assets/ai.png"
import mic from "../assets/mic.png"
import startSound from "../assets/start.mp3"
import { ImCross } from "react-icons/im"
import img from '../assets/empty.jpg'

function AISearch({ onClose }) {
  const navigate = useNavigate()
   const [query, setQuery] = useState("")
 const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
const [results, setResults] = useState(null)
  const recognitionRef = useRef(null)

  const handleMic = () => {
 const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error("Voice search isn't supported in this browser")
      return
    }

 const audio = new Audio(startSound)
    audio.play().catch(() => {})

    const recognition = new SpeechRecognition()
   recognition.lang = "en-US"
    recognition.interimResults = false
 recognitionRef.current = recognition

 recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
  recognition.onerror = () => setListening(false)
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setQuery(transcript)
      runSearch(transcript)
    }

    recognition.start()
  }

  const runSearch = async (searchQuery) => {
   const q = (searchQuery ?? query).trim()
    if (!q) return
  setLoading(true)
    setResults(null)
    try {
 const result = await axios.post(serverUrl + "/api/course/ai-search", { query: q })
      setResults(result.data.results || [])
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "AI search failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-[#000000ad] z-50 flex items-start justify-center pt-[8vh] px-4'>
  <div className='bg-white w-[100%] max-w-[600px] rounded-2xl p-6 relative max-h-[80vh] overflow-y-auto'>
        <ImCross className='absolute top-5 right-5 w-[18px] h-[18px] cursor-pointer' onClick={onClose} />

        <div className='flex items-center gap-3 mb-5'>
          <img src={ai} alt="" className='w-[36px] h-[36px] rounded-full' />
          <h2 className='text-[22px] font-bold'>Search with AI</h2>
        </div>

        <div className='flex items-center gap-2 border-2 border-black rounded-[12px] px-3 py-2'>
          <input
            type="text"
        value={query}
     onChange={(e) => setQuery(e.target.value)}
         onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder="e.g. I want to learn to build websites from scratch"
       className='flex-1 outline-none text-[15px]'
          />
          <img
            src={mic}
     alt="mic"
            onClick={handleMic}
            className={`w-[26px] h-[26px] cursor-pointer ${listening ? "animate-pulse" : ""}`}
          />
          <button
            onClick={() => runSearch()}
     className='px-[16px] py-[8px] bg-black text-white rounded-[10px] text-[14px]'
          >
            Search
          </button>
        </div>

  {listening && <p className='text-[13px] text-gray-500 mt-2'>Listening…</p>}

        <div className='mt-6 flex flex-col gap-4'>
      {loading && <p className='text-center text-gray-400 text-[14px]'>Thinking…</p>}

          {results && results.length === 0 && !loading && (
            <p className='text-center text-gray-400 text-[14px]'>No matching courses found. Try rephrasing.</p>
          )}

          {results && results.map((course) => (
            <div
              key={course._id}
              className='flex gap-3 items-center border border-gray-100 rounded-[14px] p-3 hover:shadow-md cursor-pointer transition'
              onClick={() => navigate(`/coursedetail/${course._id}`)}
            >
           <img src={course.thumbnail || img} alt="" className='w-[70px] h-[55px] rounded-[8px] object-cover shrink-0' />
              <div className='flex-1 min-w-0'>
                <h3 className='font-semibold text-[15px] truncate'>{course.title}</h3>
         <p className='text-[12px] text-gray-500 truncate'>{course.category} · {course.level || "All levels"}</p>
                {course.aiReason && <p className='text-[12px] text-[#03394b] mt-1'>{course.aiReason}</p>}
              </div>
              <p className='font-bold text-[14px] shrink-0'>{course.price ? `₹${course.price}` : "Free"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AISearch