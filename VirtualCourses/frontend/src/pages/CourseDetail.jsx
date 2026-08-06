import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { FaLock, FaPlayCircle } from 'react-icons/fa'
import img from '../assets/empty.jpg'

function CourseDetail() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)

  const [course, setCourse] = useState(null)
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [previewingId, setPreviewingId] = useState(null)

  
  const isEnrolled = userData && course?.enrolledStudent?.includes(userData._id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResult = await axios.get(serverUrl + `/api/course/getcoursebyid/${courseId}`, { withCredentials: true })
        setCourse(courseResult.data)

       
        const lectureResult = await axios.get(serverUrl + `/api/lecture/getbycourse/${courseId}`, { withCredentials: true })
        setLectures(lectureResult.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [courseId])

  const handleEnroll = async () => {
    if (!userData) {
      toast.error("Please log in to enroll")
      return navigate("/login")
    }
    setEnrolling(true)
    try {
      const result = await axios.post(serverUrl + `/api/course/enroll/${courseId}`, {}, { withCredentials: true })
 setCourse(result.data)
         toast.success("Enrolled successfully")
    } catch (error) {
  console.log(error)
      toast.error(error?.response?.data?.message || "Failed to enroll")
    } finally {
     setEnrolling(false)
    }
  }

     if (loading) return <div className='min-h-screen flex items-center justify-center'>Loading...</div>
  if (!course) return <div className='min-h-screen flex items-center justify-center'>Course not found</div>

  return (
    <div className='min-h-screen bg-gray-100 px-4 md:px-16 py-12'>
 <div className='max-w-4xl mx-auto bg-white rounded-xl shadow p-6 md:p-10'>

        <img src={course.thumbnail || img} alt={course.title} className='w-full h-56 object-cover rounded-lg mb-6' />

    <h1 className='text-2xl md:text-3xl font-bold mb-2'>{course.title}</h1>
        {course.subTitle && <p className='text-gray-600 mb-3'>{course.subTitle}</p>}

        <div className='flex flex-wrap gap-3 text-xs text-gray-500 mb-4'>
          <span className='bg-gray-100 px-3 py-1 rounded-full'>{course.category}</span>
          {course.level && <span className='bg-gray-100 px-3 py-1 rounded-full'>{course.level}</span>}
  </div>

        <p className='text-gray-700 mb-6 whitespace-pre-line'>{course.description || "No description provided yet."}</p>

        <div className='flex items-center justify-between mb-8 border-y py-4'>
  <p className='text-2xl font-bold'>{course.price ? `₹ ${course.price}` : "Free"}</p>
          {isEnrolled ? (
            <button
              className='bg-green-600 text-white px-6 py-2 rounded-md'
         onClick={() => navigate(`/watchcourse/${courseId}`)}
            >
              Go to Course
            </button>
          ) : (
            <button
              className='bg-black text-white px-6 py-2 rounded-md flex items-center gap-2'
              disabled={enrolling}
              onClick={handleEnroll}
            >
              {enrolling ? (
                <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
              ) : "Enroll Now"}
            </button>
          )}
        </div>

        <h2 className='text-xl font-semibold mb-4'>Course Content</h2>
        <div className='space-y-2'>
          {lectures.length === 0 ? (
            <p className='text-gray-400 text-sm'>No lectures added yet.</p>
          ) : (
            lectures.map((lecture, index) => {
              const canWatch = isEnrolled || lecture.isPreviewFree
              return (
                <div key={lecture._id} className='border rounded-md p-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      {canWatch ? <FaPlayCircle className='text-green-600' /> : <FaLock className='text-gray-400' />}
                      <span className='text-sm'>{index + 1}. {lecture.title}</span>
                      {lecture.isPreviewFree && !isEnrolled && (
                        <span className='text-xs text-green-600'>(Free Preview)</span>
                      )}
                    </div>
                    {canWatch && (
                      <button
                        className='text-xs text-blue-600 hover:underline'
                        onClick={() => setPreviewingId(previewingId === lecture._id ? null : lecture._id)}
                      >
                        {previewingId === lecture._id ? "Hide" : "Watch"}
                      </button>
                    )}
                  </div>
                  {canWatch && previewingId === lecture._id && (
                    <video src={lecture.videoUrl} controls className='w-full mt-3 rounded-md max-h-72' />
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseDetail