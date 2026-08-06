import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { FiCamera } from 'react-icons/fi'

function EditProfile() {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    name: userData?.name || '',
    description: userData?.description || '',
  })
  const [preview, setPreview] = useState(userData?.photoUrl || null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
   
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10'>
      <div className='bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full relative'>

       
        <button
          onClick={() => navigate(-1)}
          className='absolute top-7 left-6 text-gray-600 hover:text-black transition'
        >
          <FaArrowLeftLong className='w-5 h-5' />
        </button>
        <h1 className='text-center text-2xl font-bold text-gray-800 mb-8'>Edit Profile</h1>

       
        <div className='flex flex-col items-center mb-8'>
          <div className='relative group cursor-pointer' onClick={() => fileInputRef.current.click()}>
            {preview ? (
              <img
                src={preview}
                alt='Avatar'
                className='w-24 h-24 rounded-full object-cover border-4 border-black'
              />
            ) : (
              <div className='w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-3xl border-4 border-black'>
                {userData?.name?.slice(0, 1).toUpperCase()}
              </div>
            )}
            {/* Camera overlay */}
            <div className='absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition'>
              <FiCamera className='text-white w-6 h-6' />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleFileChange}
          />
          <p className='text-xs text-gray-400 mt-2'>Click photo to change</p>
        </div>

    <form onSubmit={handleSubmit} className='space-y-5'>

          
         <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>Full Name</label>
       <input
            type='text'
            name='name'
         value={form.name}
              onChange={handleChange}
              placeholder='Your full name'
              className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition'
            />
          </div>

         
          <div>
          <label className='block text-sm font-semibold text-gray-700 mb-1'>Email</label>
            <input
       type='email'
              value={userData?.email || ''}
              readOnly
              className='w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed'
            />
          </div>

         
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>Description</label>
            <textarea
              name='description'
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder='Tell us about yourself'
              className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition resize-none'
            />
          </div>

         
          <button
            type='submit'
            className='w-full bg-black text-white py-3 rounded-lg font-semibold text-sm tracking-wide active:bg-gray-800 transition mt-2'
          >
            Save Changes
          </button>

        </form>
      </div>
    </div>
  )
}

export default EditProfile