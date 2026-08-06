import React, { useState } from 'react'
import Nav from '../component/Nav'
import { SiViaplay } from "react-icons/si";
import Logos from '../component/Logos'
import home from "../assets/home1.jpg"
import ai from "../assets/ai.png"
import ExploreCourses from '../component/ExploreCourses'
import About from '../component/About'
import Footer from '../component/Footer'
import AISearch from '../component/AISearch'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaChartLine, FaCertificate, FaCode, FaFileAlt } from 'react-icons/fa'

function Home() {
    const [showAISearch, setShowAISearch] = useState(false)
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)

  return (
    <div className='w-[100%] overflow-hidden'>
          <div className='w-[100%] lg:h-[140vh] h-[70vh] relative'>
        <Nav/>
        <img src={home} className='object-cover md:object-fill w-[100%] lg:h-[100%] h-[50vh]' alt="" />
    <span className='lg:text-[70px] absolute md:text-[40px] lg:top-[10%] top-[15%] w-[100%] flex items-center justify-center text-white font-bold text-[20px]'>Grow your skills to advance</span>
        <span className='lg:text-[70px] absolute md:text-[20px] lg:top-[18%] top-[20%] w-[100%] flex items-center justify-center text-white font-bold text-[20px]'>your career path</span>

        <div className='absolute lg:top-[30%] top-[75%] md:top-[80%] w-[100%] px-4 flex items-center justify-center gap-3 flex-wrap'>
          <button onClick={() => navigate("/allcourses")} className='px-[20px] py-[10px] lg:bg-black border-2 lg:border-white border-black lg:text-white text-black rounded-[10px] text-[18px] font-light flex gap-2 cursor pointer'>View All Courses <SiViaplay className='w-[30px] h-[30px] lg:fill-white fill-black' /></button>
          <button onClick={() => setShowAISearch(true)} className='px-[20px] py-[10px] lg:bg-white border-2 lg:border-white border-black lg:text-black bg-black text-white rounded-[10px] text-[18px] font-light flex gap-2 cursor pointer'>Search with AI <img src={ai} alt="" className='w-[30px] h-[30px] rounded-full hidden lg:block' /></button>
        </div>
      </div>

      <Logos/>

      {userData && (
        <div className='max-w-5xl mx-auto px-4 -mt-4 mb-10'>
          <div className='bg-white rounded-2xl shadow-lg p-5 grid grid-cols-2 md:grid-cols-4 gap-3'>
            <button
              onClick={() => navigate("/mylearning")}
              className='flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-[#03394b] hover:bg-gray-50 transition-colors'
            >
              <FaChartLine className='text-[#03394b] text-xl' />
              <span className='text-sm font-medium text-gray-700'>My Learning</span>
            </button>
            <button
              onClick={() => navigate("/certificates")}
              className='flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-[#03394b] hover:bg-gray-50 transition-colors'
            >
              <FaCertificate className='text-[#03394b] text-xl' />
              <span className='text-sm font-medium text-gray-700'>Certificates</span>
            </button>
            <button
              onClick={() => navigate("/practice")}
              className='flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-[#03394b] hover:bg-gray-50 transition-colors'
            >
              <FaCode className='text-[#03394b] text-xl' />
              <span className='text-sm font-medium text-gray-700'>Practice</span>
            </button>
            <button
              onClick={() => navigate("/resumereview")}
              className='flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-[#03394b] hover:bg-gray-50 transition-colors'
            >
              <FaFileAlt className='text-[#03394b] text-xl' />
              <span className='text-sm font-medium text-gray-700'>Resume Review</span>
            </button>
          </div>
        </div>
      )}

         <ExploreCourses/>
   {showAISearch && <AISearch onClose={() => setShowAISearch(false)} />}
      <About/>
      <Footer/>
    </div>
  )
}

export default Home