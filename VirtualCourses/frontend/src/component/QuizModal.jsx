import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { serverUrl } from '../App'
import { ImCross } from "react-icons/im"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"

function QuizModal({ endpoint, title, onClose }) {
  const [loading, setLoading] = useState(true)
 const [questions, setQuestions] = useState([])
   const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")

  const fetchQuiz = async () => {
 setLoading(true)
    setError("")
    try {
      const result = await axios.post(serverUrl + endpoint, {}, { withCredentials: true })
  setQuestions(result.data.questions || [])
    } catch (err) {
      console.log(err)
    setError(err?.response?.data?.message || "Failed to generate quiz")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { fetchQuiz() }, [])

  const selectAnswer = (qIndex, optIndex) => {
    if (submitted) return
 setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))
  }

  const score = questions.reduce((sum, q, i) => sum + (answers[i] === q.correctIndex ? 1 : 0), 0)

  return (
    <div className='fixed inset-0 bg-[#000000ad] z-50 flex items-end sm:items-center justify-center'>
      <div className='bg-white w-full sm:max-w-[600px] sm:rounded-2xl rounded-t-2xl p-5 sm:p-6 relative max-h-[90vh] sm:max-h-[85vh] overflow-y-auto'>
        <ImCross className='absolute top-5 right-5 w-[16px] h-[16px] cursor-pointer' onClick={onClose} />
    <h2 className='text-[19px] sm:text-[22px] font-bold mb-5 pr-8'>{title}</h2>

        {loading && (
          <div className='flex flex-col items-center gap-2 py-16 text-gray-400 text-sm'>
      <span className='w-8 h-8 border-2 border-gray-300 border-t-[#03394b] rounded-full animate-spin'></span>
            Generating quiz…
          </div>
        )}

        {error && !loading && (
          <div className='text-center py-10'>
            <p className='text-gray-400 text-sm mb-4'>{error}</p>
    <button onClick={fetchQuiz} className='px-5 py-2 rounded-full bg-[#03394b] text-white text-sm'>Try again</button>
          </div>
        )}

        {!loading && !error && questions.length > 0 && (
          <div className='flex flex-col gap-6'>
            {questions.map((q, qIndex) => (
        <div key={qIndex}>
                <p className='font-semibold text-[14px] sm:text-[15px] mb-3'>{qIndex + 1}. {q.question}</p>
                <div className='flex flex-col gap-2'>
                  {q.options.map((opt, optIndex) => {
            const isSelected = answers[qIndex] === optIndex
                    const isCorrect = optIndex === q.correctIndex
                 let style = 'border-gray-200 hover:border-gray-400'
                    if (submitted) {
                      if (isCorrect) style = 'border-green-500 bg-green-50'
                      else if (isSelected && !isCorrect) style = 'border-red-400 bg-red-50'
                    } else if (isSelected) {
                      style = 'border-[#03394b] bg-[#03394b0d]'
                    }
                    return (
                      <button
                 key={optIndex}
                     onClick={() => selectAnswer(qIndex, optIndex)}
                        className={`text-left border-2 rounded-[10px] px-4 py-2.5 text-[13px] sm:text-[14px] flex items-center justify-between gap-2 transition-colors ${style}`}
                      >
                        <span>{opt}</span>
                  {submitted && isCorrect && <FaCheckCircle className='text-green-600 shrink-0' />}
             {submitted && isSelected && !isCorrect && <FaTimesCircle className='text-red-500 shrink-0' />}
                      </button>
                    )
                  })}
         </div>
              </div>
            ))}

            <div className='sticky bottom-0 bg-white pt-3 border-t flex items-center justify-between gap-3 flex-wrap'>
              {submitted ? (
     <p className='font-semibold text-[15px]'>Score: {score} / {questions.length}</p>
              ) : <span />}
              <button
                onClick={() => submitted ? onClose() : setSubmitted(true)}
                disabled={!submitted && Object.keys(answers).length < questions.length}
              className='px-6 py-2.5 rounded-full bg-black text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed'
              >
          {submitted ? "Close" : "Submit Quiz"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizModal