import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Monitor, Boxes, Smartphone, Shield,
  Bot, Share2, BarChart2, Cpu
} from 'lucide-react'

const categories = [
  { label: 'Web Development',  icon: Monitor,   bg: 'bg-pink-100',  iconColor: 'text-pink-400' },
  { label: 'UI UX Designing',  icon: Boxes,      bg: 'bg-green-100', iconColor: 'text-green-500' },
  { label: 'App Development',  icon: Smartphone, bg: 'bg-pink-200',  iconColor: 'text-pink-500' },
  { label: 'Ethical Hacking',  icon: Shield,     bg: 'bg-purple-100',iconColor: 'text-purple-400' },
  { label: 'AI / ML',          icon: Bot,        bg: 'bg-green-100', iconColor: 'text-green-500' },
  { label: 'Data Science',     icon: Share2,     bg: 'bg-pink-100',  iconColor: 'text-pink-400' },
  { label: 'Data Analytics',   icon: BarChart2,  bg: 'bg-purple-100',iconColor: 'text-purple-400' },
  { label: 'AI Tools',         icon: Cpu,        bg: 'bg-green-100', iconColor: 'text-green-500' },
]

function ExploreCourses() {
  const navigate = useNavigate()

  return (
    <section className='w-full px-6 md:px-16 py-16 flex flex-col md:flex-row items-center gap-12'>

     
      <div className='md:w-2/5 flex flex-col gap-5'>
        <h2 className='text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight'>
          Explore<br />Our Courses
        </h2>
        <p className='text-gray-500 text-sm leading-relaxed max-w-xs'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem vel iure
          explicabo laboriosam accusantium expedita laudantium facere magnam.
        </p>
        <button
          onClick={() => navigate('/allcourses')}
          className='flex items-center gap-3 bg-black text-white px-6 py-3 rounded-full font-semibold text-sm w-fit hover:bg-gray-800 active:scale-95 transition-all'
        >
          Explore Courses
          <span className='bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold'>→</span>
        </button>
      </div>

      
      <div className='md:w-3/5 w-full grid grid-cols-2 sm:grid-cols-4 gap-4'>
        {categories.map(({ label, icon: Icon, bg, iconColor }) => (
          <div
            key={label}
            className='flex flex-col items-center gap-2 cursor-pointer group'
          >
            <div className={`${bg} w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center group-hover:scale-105 group-hover:shadow-md transition-all duration-200`}>
              <Icon className={`${iconColor} w-7 h-7 md:w-8 md:h-8`} strokeWidth={1.5} />
            </div>
            <span className='text-xs text-center text-gray-600 font-medium leading-tight'>{label}</span>
          </div>
        ))}
      </div>

    </section>
  )
}

export default ExploreCourses