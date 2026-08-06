import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import img from '../assets/empty.jpg'

function AllCourses() {
     const navigate = useNavigate()
   const [courses, setCourses] = useState([])
        const [loading, setLoading] = useState(true)

  useEffect(() => {
   const fetchCourses = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getpublished")
           setCourses(result.data)
      } catch (error) {
  console.log(error)
      } finally {
    setLoading(false)
      }
    }
 fetchCourses()
  }, [])

  return (
    <div className='min-h-screen bg-gray-100 px-4 md:px-16 py-12'>
      <h1 className='text-3xl font-bold mb-8 text-center'>All Courses</h1>

     {loading ? (
  <p className='text-center text-gray-400'>Loading courses...</p>
      ) : courses.length === 0 ? (
      <p className='text-center text-gray-400'>No courses available yet.</p>
      ) : (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {courses.map((course) => (
            <div
              key={course._id}
       className='bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden'
             onClick={() => navigate(`/coursedetail/${course._id}`)}
            >
              <img src={course.thumbnail || img} alt={course.title} className='w-full h-36 object-cover' />
     <div className='p-4'>
           <h2 className='font-semibold text-sm mb-1 line-clamp-2'>{course.title}</h2>
                <p className='text-xs text-gray-500 mb-2'>{course.category} · {course.level || "All levels"}</p>
         <p className='font-bold text-sm'>{course.price ? `₹ ${course.price}` : "Free"}</p>
              </div>
    </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllCourses