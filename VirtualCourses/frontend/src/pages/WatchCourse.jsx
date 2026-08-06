import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { FaLock, FaPlayCircle, FaChevronLeft, FaChevronRight, FaArrowLeft, FaFileAlt, FaCheckCircle, FaRegCircle } from 'react-icons/fa'
import QuizModal from '../component/QuizModal'

function WatchCourse() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)

  const [course, setCourse] = useState(null)
  const [lectures, setLectures] = useState([])
     const [activeIndex, setActiveIndex] = useState(0)
   const [loading, setLoading] = useState(true)
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [transcript, setTranscript] = useState("")
    const [transcriptLoading, setTranscriptLoading] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [progress, setProgress] = useState({ completedLectures: [], percent: 0 })
  const [markingComplete, setMarkingComplete] = useState(false)

   const isEnrolled = userData && course?.enrolledStudent?.includes(userData._id)
  const activeLecture = lectures[activeIndex]

    useEffect(() => {
    const currentLecture = lectures[activeIndex]
     setTranscript(currentLecture?.transcript || "")
    setShowTranscript(false)
  }, [activeIndex, lectures])

   useEffect(() => {
       const fetchData = async () => {
      try {
        const courseResult = await axios.get(serverUrl + `/api/course/getcoursebyid/${courseId}`, { withCredentials: true })
         const lectureResult = await axios.get(serverUrl + `/api/lecture/getbycourse/${courseId}`, { withCredentials: true })
         const progressResult = await axios.get(serverUrl + `/api/progress/${courseId}`, { withCredentials: true })

        setCourse(courseResult.data)
         setLectures(lectureResult.data)
         setProgress(progressResult.data)
      } catch (error) {
        console.log(error)
    toast.error(error?.response?.data?.message || "Failed to load course")
      } finally {
        setLoading(false)
      }
    }
     fetchData()
  }, [courseId])

  const handleMarkComplete = async () => {
    if (!activeLecture) return
    const alreadyDone = progress.completedLectures?.some((id) => id === activeLecture._id)
    if (alreadyDone) return
    setMarkingComplete(true)
    try {
      const result = await axios.post(
        serverUrl + "/api/progress/complete-lecture",
        { courseId, lectureId: activeLecture._id },
        { withCredentials: true }
      )
      setProgress(result.data)
      if (result.data.certificateIssued) {
        toast.success("Course complete! Your certificate is ready.")
      } else {
        toast.success("Lecture marked complete")
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Failed to update progress")
    } finally {
      setMarkingComplete(false)
    }
  }
  useEffect(() => {
    if (!loading && course && userData && !isEnrolled) {
      toast.error("Enroll in this course to watch lectures")
  navigate(`/coursedetail/${courseId}`)
    }
  }, [loading, course, userData, isEnrolled])

  const goToLecture = (index) => {
      if (index < 0 || index >= lectures.length) return
    setActiveIndex(index)
  }

  const handleGenerateTranscript = async () => {
 if (transcript) {
      setShowTranscript((prev) => !prev)
      return
    }
    setTranscriptLoading(true)
    try {
      const result = await axios.post(serverUrl + `/api/ai/transcript/${activeLecture._id}`, {}, { withCredentials: true })
        setTranscript(result.data.transcript)
      setShowTranscript(true)
    } catch (error) {
          console.log(error)
      toast.error(error?.response?.data?.message || "Failed to generate transcript")
    } finally {
      setTranscriptLoading(false)
    }
  }

  if (loading) return <div className='min-h-screen flex items-center justify-center'>Loading...</div>
    if (!course) return <div className='min-h-screen flex items-center justify-center'>Course not found</div>

  if (lectures.length === 0) {
    return (
          <div className='min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center'>
        <p className='text-gray-500'>No lectures have been added to this course yet.</p>
      <button
          className='text-sm text-blue-600 hover:underline flex items-center gap-1'
          onClick={() => navigate(`/coursedetail/${courseId}`)}
        >
            <FaArrowLeft /> Back to course
        </button>
      </div>
    )
  }

  return (
        <div className='min-h-screen bg-gray-100'>
      <div className='px-4 md:px-8 py-4 bg-white border-b flex items-center justify-between'>
        <button
          className='text-sm text-gray-600 hover:text-black flex items-center gap-1'
     onClick={() => navigate(`/coursedetail/${courseId}`)}
        >
          <FaArrowLeft /> {course.title}
        </button>
       <span className='text-xs text-gray-400'>
    Lecture {activeIndex + 1} of {lectures.length}
        </span>
      </div>

      <div className='w-full bg-gray-200 h-1.5'>
        <div className='bg-[#03394b] h-1.5 transition-all' style={{ width: `${progress.percent || 0}%` }} />
      </div>

    <div className='flex flex-col lg:flex-row gap-6 p-4 md:p-8 max-w-7xl mx-auto'>
        {/* Player */}
        <div className='flex-1 min-w-0'>
   <div className='bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center'>
            {activeLecture?.videoUrl ? (
              <video
                  key={activeLecture._id}
                src={activeLecture.videoUrl}
           controls
                autoPlay
                className='w-full h-full'
              />
            ) : (
              <div className='text-gray-400 text-sm flex flex-col items-center gap-2'>
                <FaLock size={24} />
                Video unavailable
              </div>
            )}
          </div>

          <div className='bg-white rounded-lg shadow p-5 mt-4'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div>
                <h1 className='text-lg md:text-xl font-semibold mb-1'>{activeLecture?.title}</h1>
                <p className='text-xs text-gray-400'>{course.title}</p>
              </div>
              <button
                onClick={handleGenerateTranscript}
           disabled={transcriptLoading}
                className='shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#03394b] text-[#03394b] text-xs sm:text-sm font-medium hover:bg-[#03394b] hover:text-white transition-colors disabled:opacity-50'
              >
                <FaFileAlt />
                {transcriptLoading ? "Generating…" : transcript ? (showTranscript ? "Hide Transcript" : "View Transcript") : "Generate Transcript"}
              </button>
            </div>

            {showTranscript && (
        <div className='mt-4 border-t pt-4 max-h-[300px] overflow-y-auto'>
                <p className='text-sm text-gray-600 leading-relaxed whitespace-pre-wrap'>{transcript}</p>
              </div>
            )}
          </div>

          <div className='flex flex-wrap items-center gap-3 mt-4'>
            <button
              onClick={handleMarkComplete}
              disabled={markingComplete || progress.completedLectures?.some((id) => id === activeLecture?._id)}
              className='flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50'
            >
              <FaCheckCircle />
              {progress.completedLectures?.some((id) => id === activeLecture?._id) ? "Completed" : markingComplete ? "Saving…" : "Mark as Complete"}
            </button>
       <button
              onClick={() => setActiveQuiz({ endpoint: `/api/ai/quiz/lecture/${activeLecture._id}`, title: `Quiz: ${activeLecture?.title}` })}
              className='px-4 py-2 rounded-full border-2 border-[#03394b] text-[#03394b] text-xs sm:text-sm font-medium hover:bg-[#03394b] hover:text-white transition-colors'
            >
              Take Lecture Quiz
            </button>
            <button
              onClick={() => setActiveQuiz({ endpoint: `/api/ai/quiz/course/${courseId}`, title: `Final Quiz: ${course.title}` })}
              className='px-4 py-2 rounded-full bg-[#03394b] text-white text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity'
            >
              Take Final Course Quiz
            </button>
          </div>

          <div className='flex items-center justify-between mt-4'>
            <button
              className='flex items-center gap-2 px-4 py-2 rounded-md border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50'
              disabled={activeIndex === 0}
              onClick={() => goToLecture(activeIndex - 1)}
            >
              <FaChevronLeft /> Previous
            </button>
            <button
              className='flex items-center gap-2 px-4 py-2 rounded-md bg-black text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800'
        disabled={activeIndex === lectures.length - 1}
              onClick={() => goToLecture(activeIndex + 1)}
            >
              Next <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className='w-full lg:w-80 shrink-0'>
   <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='px-4 py-3 border-b'>
              <h2 className='font-semibold text-sm'>Course Content</h2>
            <p className='text-xs text-gray-400 mt-0.5'>{lectures.length} lectures</p>
            </div>
            <div className='max-h-[70vh] overflow-y-auto'>
       {lectures.map((lecture, index) => {
                const isActive = index === activeIndex
           const isPlayable = !!lecture.videoUrl
                return (
                  <button
                    key={lecture._id}
                    onClick={() => goToLecture(index)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b last:border-b-0 transition-colors ${
                      isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                   <span className='mt-0.5'>
                      {progress.completedLectures?.some((id) => id === lecture._id) ? (
                        <FaCheckCircle className='text-green-600' />
                      ) : isPlayable ? (
                        <FaPlayCircle className={isActive ? 'text-black' : 'text-gray-400'} />
                      ) : (
                        <FaLock className='text-gray-400' />
                      )}
                    </span>
             <span className={`text-sm ${isActive ? 'font-semibold' : ''}`}>
                      {index + 1}. {lecture.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {activeQuiz && (
        <QuizModal
          endpoint={activeQuiz.endpoint}
      title={activeQuiz.title}
         onClose={() => setActiveQuiz(null)}
        />
      )}
    </div>
  )
}

export default WatchCourse