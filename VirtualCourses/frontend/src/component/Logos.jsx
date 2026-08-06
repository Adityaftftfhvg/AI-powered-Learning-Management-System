import React from 'react'
import { MdOutlineCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { AiFillDollarCircle } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa6";
function Logos() {
  return (
    <div className='w-[100vw] min-h-[90px] flex items-center justify-center flex-wrap gap-4 md:mb-[50px]'>
      <div className='flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer text-[#03394b]'><MdOutlineCastForEducation className='w-[35px] h-[35px] fill-[#03394b]'/> 20k+ online courses </div>
      <div className='flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer text-[#03394b]'><SiOpenaccess className='w-[35px] h-[35px] fill-[#03394b]'/> Lifetime Access </div>
      <div className='flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer text-[#03394b]'><AiFillDollarCircle className='w-[35px] h-[35px] fill-[#03394b]'/> Value for money </div>
      <div className='flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer text-[#03394b]'><BiSupport className='w-[35px] h-[35px] fill-[#03394b]'/> Lifetime support </div>
      <div className='flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer text-[#03394b]'><FaUsers /> Community support </div>
    </div>
  )
}

export default Logos