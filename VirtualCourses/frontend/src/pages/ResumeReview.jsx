import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { serverUrl } from '../App'
import { FaArrowLeft } from 'react-icons/fa'

function ResumeReview() {
  const navigate = useNavigate()
  const [resumeText, setResumeText] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleReview = async () => {
    if (resumeText.trim().length < 50) {
      toast.error("Paste your full resume text (at least 50 characters)")
      return
    }
    setLoading(true)
    setReview(null)
    try {
      const result = await axios.post(
        serverUrl + "/api/resume/review",
        { resumeText, targetRole },
        { withCredentials: true }
      )
      setReview(result.data)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Failed to review resume")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='px-4 md:px-8 py-4 bg-white border-b flex items-center justify-between'>
        <button
          className='text-sm text-gray-600 hover:text-black flex items-center gap-1'
          onClick={() => navigate("/mylearning")}
        >
          <FaArrowLeft /> AI Resume Review
        </button>
      </div>

      <div className='max-w-4xl mx-auto p-4 md:p-8 grid md:grid-cols-2 gap-6'>
        <div className='bg-white rounded-lg shadow p-5'>
          <label className='text-xs text-gray-500 block mb-1'>Target Role</label>
          <input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder='e.g. Full Stack Developer'
            className='w-full border rounded px-3 py-2 text-sm mb-4'
          />
          <label className='text-xs text-gray-500 block mb-1'>Paste Resume Text</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder='Paste your resume content here...'
            className='w-full h-72 border rounded p-3 text-sm'
          />
          <button
            onClick={handleReview}
            disabled={loading}
            className='mt-4 px-5 py-2 rounded-full bg-[#03394b] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50'
          >
            {loading ? "Reviewing…" : "Review My Resume"}
          </button>
        </div>

        <div className='bg-white rounded-lg shadow p-5'>
          {!review ? (
            <p className='text-xs text-gray-400'>Your ATS score and feedback will appear here.</p>
          ) : (
            <div className='space-y-4'>
              <div className='text-center'>
                <p className='text-3xl font-bold text-[#03394b]'>{review.atsScore}/100</p>
                <p className='text-xs text-gray-400'>ATS Score</p>
              </div>
              <p className='text-sm text-gray-700'>{review.summary}</p>

              {review.strengths?.length > 0 && (
                <div>
                  <p className='text-xs font-semibold text-green-600 mb-1'>Strengths</p>
                  <ul className='list-disc pl-5 text-sm text-gray-600'>
                    {review.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              {review.weaknesses?.length > 0 && (
                <div>
                  <p className='text-xs font-semibold text-red-600 mb-1'>Weaknesses</p>
                  <ul className='list-disc pl-5 text-sm text-gray-600'>
                    {review.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              {review.missingKeywords?.length > 0 && (
                <div>
                  <p className='text-xs font-semibold text-gray-700 mb-1'>Missing Keywords</p>
                  <div className='flex flex-wrap gap-2'>
                    {review.missingKeywords.map((k, i) => (
                      <span key={i} className='text-xs bg-gray-100 px-2 py-1 rounded'>{k}</span>
                    ))}
                  </div>
                </div>
              )}
              {review.suggestions?.length > 0 && (
                <div>
                  <p className='text-xs font-semibold text-gray-700 mb-1'>Suggestions</p>
                  <ul className='list-disc pl-5 text-sm text-gray-600'>
                    {review.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeReview