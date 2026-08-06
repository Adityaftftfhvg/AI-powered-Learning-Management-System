import React from 'react'
import logo from "../assets/logo.jpg"
import { useNavigate } from 'react-router-dom'
import { FaInstagram, FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa"

function Footer() {
  const navigate = useNavigate()

  return (
    <div className='w-[100%] bg-black text-white pt-[60px] pb-[25px] px-[5%]'>
      <div className='max-w-[1200px] mx-auto flex flex-wrap gap-[40px] justify-between'>

     <div className='flex flex-col gap-4 max-w-[300px]'>
          <img src={logo} alt="VirtualCourses" className='w-[60px] rounded-[5px] border-2 border-white' />
   <p className='text-gray-400 text-[14px] leading-relaxed'>
            VirtualCourses is an AI-powered learning platform helping students learn from real
            educators and grow their skills at their own pace.
    </p>
          <div className='flex items-center gap-4 mt-1'>
     <FaInstagram className='w-[20px] h-[20px] cursor-pointer hover:fill-gray-400' />
         <FaLinkedin className='w-[20px] h-[20px] cursor-pointer hover:fill-gray-400' />
            <FaGithub className='w-[20px] h-[20px] cursor-pointer hover:fill-gray-400' />
  <FaTwitter className='w-[20px] h-[20px] cursor-pointer hover:fill-gray-400' />
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <h3 className='font-semibold text-[16px] mb-1'>Quick Links</h3>
     <span className='text-gray-400 text-[14px] cursor-pointer hover:text-white' onClick={() => navigate("/")}>Home</span>
         <span className='text-gray-400 text-[14px] cursor-pointer hover:text-white' onClick={() => navigate("/allcourses")}>All Courses</span>
  <span className='text-gray-400 text-[14px] cursor-pointer hover:text-white' onClick={() => navigate("/login")}>Login</span>
          <span className='text-gray-400 text-[14px] cursor-pointer hover:text-white' onClick={() => navigate("/signup")}>Sign Up</span>
        </div>

        <div className='flex flex-col gap-3'>
   <h3 className='font-semibold text-[16px] mb-1'>For Educators</h3>
          <span className='text-gray-400 text-[14px] cursor-pointer hover:text-white' onClick={() => navigate("/signup")}>Become an Educator</span>
       <span className='text-gray-400 text-[14px] cursor-pointer hover:text-white' onClick={() => navigate("/dashboard")}>Educator Dashboard</span>
        </div>

        <div className='flex flex-col gap-3'>
  <h3 className='font-semibold text-[16px] mb-1'>Contact</h3>
          <span className='text-gray-400 text-[14px]'>support@virtualcourses.com</span>
       <span className='text-gray-400 text-[14px]'>Mon – Fri, 9am – 6pm</span>
        </div>

      </div>

      <div className='max-w-[1200px] mx-auto border-t border-gray-800 mt-[40px] pt-[20px] flex flex-wrap items-center justify-between gap-3'>
        <span className='text-gray-500 text-[13px]'>© {new Date().getFullYear()} VirtualCourses. All rights reserved.</span>
        <div className='flex items-center gap-4 text-gray-500 text-[13px]'>
    <span className='cursor-pointer hover:text-white'>Privacy Policy</span>
         <span className='cursor-pointer hover:text-white'>Terms of Service</span>
        </div>
      </div>
    </div>
  )
}

export default Footer