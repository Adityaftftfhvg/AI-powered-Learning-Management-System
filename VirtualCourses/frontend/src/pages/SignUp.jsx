import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import google from '../assets/google.jpg'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import {useDispatch} from 'react-redux'
import { setUserData } from '../redux/userSlice'
function SignUp() {
  
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState("student")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleSignup = async () => {
    try {
      setLoading(true)
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        { name, password, email, role },
        { withCredentials: true }
      )
      dispatch(setUserData(result.data))  
      console.log(result.data)
      setLoading(false)
      navigate("/")
      toast.success("Signed up successfully")
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.response?.data?.message || "Network error. Is the server running?")
    }
  }

  return (
    <div className='bg-[#dddbdb] w-full min-h-screen flex items-center justify-center py-8 px-4'>
      <div className='w-full max-w-3xl md:h-[500px] bg-white shadow-xl rounded-2xl flex flex-col md:flex-row overflow-hidden'>

        <div className='w-full md:w-1/2 h-full flex flex-col items-center justify-center gap-4 px-6 sm:px-8 py-10 md:py-0'>
          <div className='text-center'>
            <h1 className='font-semibold text-black text-2xl'>Let's get started</h1>
            <p className='text-[#999797] text-base mt-1'>Create your Account</p>
          </div>

          <input
            type='text'
            placeholder='Full Name'
            className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-500'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />

          <input
            type='email'
            placeholder='Email'
            className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-500'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

          <div className='w-full flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:border-gray-500'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              className='flex-1 text-sm outline-none'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span
              className='cursor-pointer text-gray-400 hover:text-gray-600 ml-2'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </span>
          </div>

          <div className='flex md:w-[50%] w-[70%] items-center justify-between'>
            <span
              className={`px-[10px] py-[5px] border-[2px] rounded-2xl cursor-pointer ${role === "student" ? "border-black" : "border-[#e7e6e6]"}`}
              onClick={() => setRole("student")}
            >Student</span>
            <span
              className={`px-[10px] py-[5px] border-[2px] rounded-2xl cursor-pointer ${role === "Educator" ? "border-black" : "border-[#e7e6e6]"}`}
              onClick={() => setRole("Educator")}
            >Educator</span>
          </div>

          <button
            className='w-[80%] h-[40px] bg-black text-white rounded-lg cursor-pointer py-2 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center'
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? <ClipLoader size={18} color='white' /> : "Sign Up"}
          </button>

          <div className='w-[80%] flex items-center gap-2'>
            <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
            <div className='w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center'>Or Continue</div>
            <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
          </div>

         <div
            className='w-[80%] h-[40px] border border-black rounded-[5px] flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-50'
            onClick={() => window.location.href = `${serverUrl}/api/auth/google`}
          >
            <img src={google} alt="google" height={18} width={18} />
            <span className='text-[18px] text-gray-500'>oogle</span>
          </div>
          <p className='text-xs text-gray-400'>
            Already have an account?{' '}
            <span className='text-black underline cursor-pointer' onClick={() => navigate("/Login")}>Sign In</span>
          </p>
        </div>

        <div className='w-full md:w-1/2 h-24 md:h-full bg-black flex flex-row md:flex-col items-center justify-center gap-3'>
          <img src={logo} alt='logo' className='w-10 md:w-20' />
          <span className='text-white text-xs tracking-widest'>UPSKILLR</span>
        </div>

      </div>
    </div>
  )
}

export default SignUp