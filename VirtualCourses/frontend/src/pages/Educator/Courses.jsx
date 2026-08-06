import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6"
import { FaEdit } from "react-icons/fa"
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../../App'
import { setCreatorCourses } from '../../redux/courseSlice'
import img from '../../assets/empty.jpg'

function Courses() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { creatorCourses } = useSelector(state => state.course)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCreatorCourses = async () => {
      try {
   const result = await axios.get(serverUrl + "/api/course/getcreator", { withCredentials: true })
        dispatch(setCreatorCourses(result.data))
      } catch (error) {
       console.log(error)
      } finally {
     setLoading(false)
      }
    }
    fetchCreatorCourses()
  }, [])
 
  return (
    <div className='flex flex-col min-h-screen bg-gray-100 p-4'>
      <div className='w-[100%] min-h-screen p-4 sm:p-6 bg-gray-100'>

    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3'>
          <div className='flex items-center justify-center gap-3'>
      <FaArrowLeftLong className='w-[22px] h-[22px] cursor-pointer' onClick={() => navigate(-1)} />
            <h1 className='text-2xl font-semibold'>All Created Courses</h1>
          </div>
  <button className='bg-[black] text-white px-4 py-2 rounded hover:bg-gray-500' onClick={() => navigate("/createcourses")}>
            Create Course
          </button>
        </div>

        {loading ? (
          <p className='text-center text-gray-400 mt-10'>Loading courses...</p>
        ) : creatorCourses.length === 0 ? (
          <p className='text-center text-gray-400 mt-10'>No courses created yet.</p>
        ) : (
          <>
            {/* Large screen table */}
            <div className='hidden md:block bg-white rounded-xl shadow p-4 overflow-x-auto'>
        <table className='min-w-full text-sm'>
                <thead className='border-b bg-gray-50'>
                  <tr>
             <th className='text-left py-4 px-3'>Courses</th>
                  <th className='text-left py-4 px-3'>Price</th>
                    <th className='text-left py-4 px-3'>Status</th>
                    <th className='text-left py-4 px-3'>Action</th>
           </tr>
                </thead>
                <tbody>
          {creatorCourses.map((course) => (
                    <tr key={course._id} className='border-b hover:bg-gray-50 transition duration-200'>
                 <td className='py-3 px-4 flex items-center gap-4'>
                        <img src={course.thumbnail || img} className='w-25 h-14 object-cover rounded-md' alt="" />
                        <span>{course.title}</span>
              </td>
                      <td className='px-4 py-3'>{course.price ? `₹ ${course.price}` : "₹ NA"}</td>
                      <td className='px-4 py-3'>
              <span className={`px-3 py-1 rounded-full text-xs ${course.isPublished ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {course.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
          <td className='px-4 py-3'>
                        <FaEdit className='text-gray-600 hover:text-blue-600 cursor-pointer' onClick={() => navigate(`/editcourse/${course._id}`)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
          </table>
              <p className='text-center text-sm text-gray-400 mt-6'>List of your recent courses</p>
            </div>

            {/* Small screen cards */}
            <div className='md:hidden space-y-4'>
              {creatorCourses.map((course) => (
                <div key={course._id} className='bg-white rounded-lg shadow p-4 flex flex-col gap-3'>
        <div className='flex gap-4 items-center'>
                    <img src={course.thumbnail || img} alt="" className='w-16 h-16 rounded-md object-cover' />
                    <div className='flex-1'>
                 <h2 className='font-medium text-sm'>{course.title}</h2>
                      <p className='text-gray-600 text-xs mt-1'>{course.price ? `₹ ${course.price}` : "₹ NA"}</p>
                    </div>
                    <FaEdit className='text-gray-600 hover:text-blue-600 cursor-pointer' onClick={() => navigate(`/editcourse/${course._id}`)} />
             </div>
                  <span className={`w-fit px-3 py-1 text-xs rounded-full ${course.isPublished ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
      </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Courses