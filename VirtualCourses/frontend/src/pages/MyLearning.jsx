import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { FaArrowLeft, FaFire, FaStar, FaCertificate, FaCode } from 'react-icons/fa'

function MyLearning() {
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)
  const [progressList, setProgressList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/progress/summary/me", { withCredentials: true })
        setProgressList(result.data)
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || "Failed to load progress")
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [])

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='px-4 md:px-8 py-4 bg-white border-b flex items-center justify-between'>
        <button
          className='text-sm text-gray-600 hover:text-black flex items-center gap-1'
          onClick={() => navigate("/profile")}
        >
          <FaArrowLeft /> My Learning
        </button>
      </div>

      <div className='max-w-5xl mx-auto p-4 md:p-8'>
       
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
          <div className='bg-white rounded-lg shadow p-5 flex items-center gap-3'>
            <FaFire className='text-orange-500 text-2xl' />
            <div>
              <p className='text-xl font-bold'>{userData?.streak || 0}</p>
              <p className='text-xs text-gray-400'>Day streak</p>
            </div>
          </div>
          <div className='bg-white rounded-lg shadow p-5 flex items-center gap-3'>
            <FaStar className='text-yellow-500 text-2xl' />
            <div>
              <p className='text-xl font-bold'>{userData?.xp || 0}</p>
              <p className='text-xs text-gray-400'>XP earned</p>
            </div>
          </div>
          <div className='bg-white rounded-lg shadow p-5 flex items-center gap-3'>
            <FaCode className='text-[#03394b] text-2xl' />
            <div>
              <p className='text-xl font-bold'>{userData?.solvedProblems || 0}</p>
              <p className='text-xs text-gray-400'>Problems solved</p>
            </div>
          </div>
        </div>

       
        <div className='flex flex-wrap gap-3 mb-8'>
          <button
            onClick={() => navigate("/certificates")}
            className='flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#03394b] text-[#03394b] text-sm font-medium hover:bg-[#03394b] hover:text-white transition-colors'
          >
            <FaCertificate /> My Certificates
          </button>
          <button
            onClick={() => navigate("/practice")}
            className='flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#03394b] text-[#03394b] text-sm font-medium hover:bg-[#03394b] hover:text-white transition-colors'
          >
            <FaCode /> Practice Problems
          </button>
          <button
            onClick={() => navigate("/resumereview")}
            className='px-4 py-2 rounded-full bg-[#03394b] text-white text-sm font-medium hover:opacity-90 transition-opacity'
          >
            AI Resume Review
          </button>
        </div>

       
        <h2 className='text-lg font-semibold mb-4'>Course Progress</h2>
        {loading ? (
          <p className='text-gray-400 text-sm'>Loading...</p>
        ) : progressList.length === 0 ? (
          <p className='text-gray-400 text-sm'>You haven't started any course yet.</p>
        ) : (
          <div className='grid sm:grid-cols-2 gap-4'>
            {progressList.map((p) => (
              <div
                key={p._id}
                className='bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow'
                onClick={() => navigate(`/watchcourse/${p.course?._id}`)}
              >
                <div className='flex items-center gap-3'>
                  <img
                    src={p.course?.thumbnail}
                    alt=""
                    className='w-16 h-16 rounded object-cover bg-gray-200 shrink-0'
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold truncate'>{p.course?.title}</p>
                    <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                      <div
                        className='bg-[#03394b] h-2 rounded-full transition-all'
                        style={{ width: `${p.percent}%` }}
                      />
                    </div>
                    <p className='text-xs text-gray-400 mt-1'>{p.percent}% complete</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyLearning