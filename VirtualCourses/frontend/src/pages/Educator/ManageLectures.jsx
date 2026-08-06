import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-toastify'
import { serverUrl } from '../../App'

function ManageLectures() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const [title, setTitle] = useState("")
  const [videoFile, setVideoFile] = useState(null)
  const [isPreviewFree, setIsPreviewFree] = useState(false)

  const fetchLectures = async () => {
    try {
      const result = await axios.get(serverUrl + `/api/lecture/getbycourse/${courseId}`, { withCredentials: true })
      setLectures(result.data)
    } catch (error) {
      console.log(error)
      toast.error("Failed to load lectures")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLectures()
  }, [courseId])

  const handleAddLecture = async () => {
    if (!title) return toast.error("Lecture title is required")
    if (!videoFile) return toast.error("Please select a video file")

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("isPreviewFree", isPreviewFree)
      formData.append("video", videoFile)

      const result = await axios.post(
        serverUrl + `/api/lecture/create/${courseId}`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      )

      setLectures(prev => [...prev, result.data])
      toast.success("Lecture added")
      setTitle("")
      setVideoFile(null)
      setIsPreviewFree(false)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Failed to add lecture")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (lectureId) => {
    if (!window.confirm("Delete this lecture?")) return
    try {
      await axios.delete(serverUrl + `/api/lecture/remove/${lectureId}`, { withCredentials: true })
      setLectures(prev => prev.filter(l => l._id !== lectureId))
      toast.success("Lecture removed")
    } catch (error) {
      console.log(error)
      toast.error("Failed to remove lecture")
    }
  }

 
  const moveLecture = async (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= lectures.length) return

    const reordered = [...lectures]
    ;[reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]]
    setLectures(reordered)

    try {
      await axios.post(
        serverUrl + `/api/lecture/reorder/${courseId}`,
        { lectureIds: reordered.map(l => l._id) },
        { withCredentials: true }
      )
    } catch (error) {
      console.log(error)
      toast.error("Failed to save new order")
      fetchLectures() 
    }
  }

  if (loading) {
    return <div className='min-h-screen flex items-center justify-center'>Loading...</div>
  }

  return (
    <div className='min-h-screen bg-gray-100 px-4 py-10'>
      <div className='max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md relative'>
 <FaArrowLeftLong className='w-[22px] h-[22px] cursor-pointer mb-4' onClick={() => navigate(`/editcourse/${courseId}`)} />
      <h2 className='text-2xl font-semibold mb-6 text-center'>Manage Lectures</h2>

        {/* Existing lectures list */}
        <div className='space-y-3 mb-8'>
          {lectures.length === 0 ? (
  <p className='text-center text-gray-400'>No lectures added yet.</p>
          ) : (
            lectures.map((lecture, index) => (
              <div key={lecture._id} className='flex items-center justify-between border rounded-md p-3'>
      <div>
           <p className='font-medium'>{index + 1}. {lecture.title}</p>
                  {lecture.isPreviewFree && (
                    <span className='text-xs text-green-600'>Free Preview</span>
            )}
    </div>
                <div className='flex items-center gap-3'>
      <FaArrowUp className={`cursor-pointer ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-black'}`} onClick={() => moveLecture(index, "up")} />
            <FaArrowDown className={`cursor-pointer ${index === lectures.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:text-black'}`} onClick={() => moveLecture(index, "down")} />
                 <FaTrash className='text-red-500 hover:text-red-700 cursor-pointer' onClick={() => handleDelete(lecture._id)} />
        </div>
              </div>
            ))
          )}
        </div>

     {/* Add new lecture form  */}
        <div className='border-t pt-6 space-y-4'>
     <h3 className='font-semibold'>Add New Lecture</h3>

         <div>
     <label className='block text-sm font-medium text-gray-700 mb-1'>Lecture Title</label>
         <input
    type="text"
              className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black'
        value={title}
             onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
  <label className='block text-sm font-medium text-gray-700 mb-1'>Video File</label>
       <input
              type="file"
           accept="video/*"
        onChange={(e) => setVideoFile(e.target.files[0])}
            />
          </div>

      <div className='flex items-center gap-2'>
            <input
              type="checkbox"
     id="isPreviewFree"
        checked={isPreviewFree}
              onChange={(e) => setIsPreviewFree(e.target.checked)}
            />
            <label htmlFor="isPreviewFree" className='text-sm text-gray-700'>Allow free preview (visible without enrolling)</label>
          </div>

          <button
     type="button"
        className='w-full bg-black text-white py-2 px-4 rounded-md active:bg-[#3a3a3a] transition flex justify-center items-center'
           disabled={uploading}
            onClick={handleAddLecture}
          >
            {uploading ? (
              <span className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
       ) : "Add Lecture"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageLectures