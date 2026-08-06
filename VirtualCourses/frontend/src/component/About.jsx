import React from 'react'
import about from "../assets/about.jpg"
import { MdOutlineCastForEducation } from "react-icons/md"
import { HiOutlineSparkles } from "react-icons/hi2"
import { FaChalkboardTeacher } from "react-icons/fa"

function About() {
  return (
    <div className='w-[100%] px-[5%] py-[80px] flex items-center justify-center'>
      <div className='w-[100%] max-w-[1200px] flex lg:flex-row flex-col items-center gap-[50px]'>

        <div className='lg:w-[45%] w-[100%]'>
          <img src={about} alt="About VirtualCourses" className='w-[100%] rounded-[20px] object-cover max-h-[450px]' />
        </div>

     <div className='lg:w-[55%] w-[100%] flex flex-col gap-5'>
         <span className='text-[#03394b] font-semibold text-[16px]'>ABOUT US</span>
  <h2 className='text-[32px] md:text-[42px] font-bold leading-tight'>Learning, powered by real teaching and real AI</h2>
          <p className='text-gray-600 text-[16px] leading-relaxed'>
       VirtualCourses is a learning platform built for people who want to actually finish what they start.
          We pair hands-on courses from real educators with AI tools that help you study smarter — from
            instant answers to personalized course recommendations.
          </p>

          <div className='flex flex-col gap-4 mt-3'>
     <div className='flex items-center gap-4'>
              <div className='w-[50px] h-[50px] shrink-0 rounded-[12px] bg-[#03394b] flex items-center justify-center'>
                <MdOutlineCastForEducation className='w-[26px] h-[26px] fill-white' />
              </div>
              <div>
       <h3 className='font-semibold text-[17px]'>Expert-led courses</h3>
                <p className='text-gray-500 text-[14px]'>Taught by educators who build and ship real projects.</p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
        <div className='w-[50px] h-[50px] shrink-0 rounded-[12px] bg-[#03394b] flex items-center justify-center'>
                <HiOutlineSparkles className='w-[26px] h-[26px] fill-white' />
              </div>
              <div>
                <h3 className='font-semibold text-[17px]'>AI-assisted learning</h3>
                <p className='text-gray-500 text-[14px]'>Search courses and get help using built-in AI tools.</p>
          </div>
            </div>

       <div className='flex items-center gap-4'>
              <div className='w-[50px] h-[50px] shrink-0 rounded-[12px] bg-[#03394b] flex items-center justify-center'>
                <FaChalkboardTeacher className='w-[24px] h-[24px] fill-white' />
              </div>
              <div>
         <h3 className='font-semibold text-[17px]'>Learn at your pace</h3>
                <p className='text-gray-500 text-[14px]'>Lifetime access to every course you enroll in.</p>
              </div>
      </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default About