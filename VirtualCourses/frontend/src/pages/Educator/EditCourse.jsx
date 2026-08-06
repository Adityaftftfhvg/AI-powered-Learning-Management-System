import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeftLong } from 'react-icons/fa6'
import axios from 'axios'
import { toast } from 'react-toastify'

import { useDispatch } from 'react-redux'
import { serverUrl } from '../../App'
import { updateCourseInList, removeCourseFromList } from '../../redux/courseSlice'
import img from '../../assets/empty.jpg'

function EditCourse() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [pageLoading, setPageLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState("")
  const [subTitle, setSubTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("App development")
  const [level, setLevel] = useState("Beginner")
  const [price, setPrice] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(img)

 
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const result = await axios.get(serverUrl + `/api/course/getcoursebyid/${courseId}`, { withCredentials: true })
        const course = result.data
        setTitle(course.title || "")
        setSubTitle(course.subTitle || "")
        setDescription(course.description || "")
        setCategory(course.category || "App development")
        setLevel(course.level || "Beginner")
        setPrice(course.price || "")
        setIsPublished(course.isPublished || false)
        if (course.thumbnail) setThumbnailPreview(course.thumbnail)
      } catch (error) {
        console.log(error)
        toast.error("Failed to load course")
      } finally {
        setPageLoading(false)
      }
    }
    fetchCourse()
  }, [courseId])

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    if (!title) {
      return toast.error("Title is required")
    }
    setSaving(true)
    try {
      
      const formData = new FormData()
      formData.append("title", title)
     formData.append("subTitle", subTitle)
      formData.append("description", description)
      formData.append("category", category)
  formData.append("level", level)
    formData.append("price", price)
   formData.append("isPublished", isPublished)
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile)
      }

 const result = await axios.post(
     serverUrl + `/api/course/editcourse/${courseId}`,
  formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      )
      dispatch(updateCourseInList(result.data))
      toast.success("Course updated")
   navigate("/courses")
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Failed to update course")
    } finally {
    setSaving(false)
    }
  }

  const handleDelete = async () => {
  if (!window.confirm("Delete this course permanently? This cannot be undone.")) return
    try {
   await axios.delete(serverUrl + `/api/course/remove/${courseId}`, { withCredentials: true })
   dispatch(removeCourseFromList(courseId))
 toast.success("Course removed")
      navigate("/courses")
    } catch (error) {
      console.log(error)
 toast.error(error?.response?.data?.message || "Failed to delete course")
    }
  }

  if (pageLoading) {
    return <div className='min-h-screen flex items-center justify-center'>Loading...</div>
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10'>
      <div className='max-w-2xl w-full mx-auto p-6 shadow-md rounded-md bg-white mt-10 relative'>
        <FaArrowLeftLong className='top-[8%] absolute left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={() => navigate("/courses")} />
      <h2 className='text-2xl font-semibold mb-6 text-center'>Edit Course</h2>
        <div className='space-y-5'>
          <div className='flex flex-col items-center gap-3'>
     <img src={thumbnailPreview} alt="thumbnail" className='w-40 h-24 object-cover rounded-md border' />
     <input type="file" accept="image/*" onChange={handleThumbnailChange} className='text-sm' />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Course Title</label>
            <input type="text" className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black' value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Subtitle</label>
            <input type="text" className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black' value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
            <textarea rows={4} className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black' value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
              <select className='w-full border border-gray-300 rounded-md px-2 py-2 text-sm' value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="App development">App Development</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Data Science">Data Science</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Ethical Hacking">Ethical Hacking</option>
                <option value="UI UX Designing">UI UX Designing</option>
                <option value="Web Development">Web Development</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Level</label>
              <select className='w-full border border-gray-300 rounded-md px-2 py-2 text-sm' value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Price (₹)</label>
            <input type="number" min="0" className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black' value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div className='flex items-center gap-2'>
            <input type="checkbox" id="isPublished" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            <label htmlFor="isPublished" className='text-sm font-medium text-gray-700'>Publish this course (visible to students)</label>
          </div>
    <button
  type="button"
       className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition'
      onClick={() => navigate(`/managelectures/${courseId}`)}
>
  Manage Lectures
</button>
          <div className='flex gap-3 pt-2'>
            <button className='flex-1 bg-black text-white py-2 px-4 rounded-md active:bg-[#3a3a3a] transition flex justify-center items-center' disabled={saving} onClick={handleSave}>
  {saving ? (
    <span className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
  ) : "Save Changes"}
</button>
            <button className='flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition' onClick={handleDelete}>
              Delete Course
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditCourse