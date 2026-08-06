import React from 'react'
import { useSelector } from 'react-redux'
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaFire, FaStar, FaCertificate } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'
function Profile() {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center'>
      <div className='bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full relative'>
        <FaArrowLeftLong className='absolute top-[8%] left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/")}/>
        <div className='flex flex-col items-center text-center'>
         {
           userData?.photoUrl ?  <img
            src={userData?.photoUrl}
            className='w-24 h-24 rounded-full object-cover border-4 border-black'
            alt="Profile"
          />:
           <div className='w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black border-white'>
              {userData?.name.slice(0,1).toUpperCase()}
           </div>
         }

         <h2 className='text-2xl font-bold mt-4 text-gray-800'> {userData.name}</h2>
         <p className='text-sm text-gray-500'>{userData.role}</p>
        </div>

        <div className='mt-6 space-y-4'>
          <div className='text-sm flex item-center justify-start gap-1'>
            <span className='font-semibold text-gray-700'>Email: </span>
            <span>{userData.email}</span>
          </div>
     
     <div className='text-sm flex item-center justify-start gap-1'>
            <span className='font-semibold text-gray-700'>Bio: </span>
            <span>{userData.description}</span>
          </div>

      <div className='text-sm flex item-center justify-start gap-1'>
            <span className='font-semibold text-gray-700'>Enrolled Courses: </span>
            <span>{userData.enrolledCourses.length}</span>
          </div>
        </div>

        <div className='mt-6 grid grid-cols-3 gap-2 sm:gap-3 text-center'>
          <div className='bg-gray-50 rounded-lg p-3'>
            <FaFire className='text-orange-500 mx-auto mb-1' />
            <p className='text-sm font-bold'>{userData?.streak || 0}</p>
            <p className='text-[10px] text-gray-400'>Streak</p>
          </div>
          <div className='bg-gray-50 rounded-lg p-3'>
            <FaStar className='text-yellow-500 mx-auto mb-1' />
            <p className='text-sm font-bold'>{userData?.xp || 0}</p>
            <p className='text-[10px] text-gray-400'>XP</p>
          </div>
          <div className='bg-gray-50 rounded-lg p-3 cursor-pointer' onClick={() => navigate("/certificates")}>
            <FaCertificate className='text-[#03394b] mx-auto mb-1' />
            <p className='text-[10px] text-gray-400'>Certificates</p>
          </div>
        </div>

        <div className='mt-6 flex justify-center gap-4'>
     <button className='px-5 py-2 rounded bg-[black] text-white active:bg-[#4b4b4b] cursor-pointer transition'onClick={()=>navigate("/editprofile")}>

      Edit profile
     </button>
     <button className='px-5 py-2 rounded border border-[#03394b] text-[#03394b] cursor-pointer transition' onClick={()=>navigate("/mylearning")}>
      My learning
     </button>

        </div>
      </div>
    </div>
  )
}

export default Profile