import React, { useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { serverUrl } from '../../App'
import { useDispatch } from 'react-redux'
import { addCourse } from '../../redux/courseSlice'

function CreateCourses() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("App development")
  const [loading, setLoading] = useState(false)

  const handleCreateCourse = async () => {
    if (!title || !category) {
      return toast.error("Title and category are required")
    }
    setLoading(true)
    try {
      const result = await axios.post(
        serverUrl + "/api/course/create",
        { title, category },
        { withCredentials: true }
      )
      dispatch(addCourse(result.data))
      toast.success("Course Created")
      navigate("/courses")
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10'>
      <div className='max-w-xl w-full mx-auto p-6 shadow-md rounded-md mt-10 relative'>
        <FaArrowLeftLong className='top-[8%] absolute left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={() => navigate("/courses")} />
        <h2 className='text-2xl font-semibold mb-6 text-center'>Create Course</h2>

        <div className='space-y-5'>
          <div>
            <label htmlFor="title" className='block text-sm font-medium text-gray-700 mb-1'>Course Title</label>
            <input type="text" id='title' placeholder='Enter course Title' className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[black]' onChange={(e) => setTitle(e.target.value)} value={title} />
          </div>

          <div>
            <label htmlFor="cat" className='block text-lg font-medium text-gray-700 mb-1'>Course Category</label>
            <select id="cat" className='block w-full border border-gray-300 rounded-md px-2 py-2 text-sm font-medium text-gray-700 mb-1' value={category} onChange={(e) => setCategory(e.target.value)}>
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

          <button type="button" className='w-full bg-[black] text-white py-2 px-4 rounded-md active:bg-[#3a3a3a] transition flex justify-center items-center' disabled={loading} onClick={handleCreateCourse}>
            {loading ? (
              <span className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
            ) : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateCourses