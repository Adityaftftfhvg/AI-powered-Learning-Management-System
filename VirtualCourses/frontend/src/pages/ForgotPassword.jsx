import React, { useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {
  const [step, setStep] = useState(1) // 1 = enter email, 2 = enter OTP + new password
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const sendOtp = async () => {
    try {
      setLoading(true)
      await axios.post(serverUrl + "/api/auth/forgot-password", { email })
      toast.success("OTP sent to your email!")
      setStep(2)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async () => {
    try {
      setLoading(true)
      await axios.post(serverUrl + "/api/auth/reset-password", { email, otp, newPassword })
      toast.success("Password reset successfully!")
      navigate("/login")
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-[#dddbdb] w-full min-h-screen flex items-center justify-center py-8 px-4'>
      <div className='w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col gap-4'>
        <h1 className='text-2xl font-semibold text-center'>Forgot Password</h1>

        {step === 1 && (
          <>
            <p className='text-sm text-gray-500 text-center'>Enter your registered email to receive an OTP</p>
            <input
              type='email'
              placeholder='Email'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={sendOtp}
              disabled={loading}
              className='w-full bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-800'
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className='text-sm text-gray-500 text-center'>Check your email and enter the OTP</p>
            <input
              type='text'
              placeholder='Enter OTP'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type='password'
              placeholder='New Password'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={resetPassword}
              disabled={loading}
              className='w-full bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-800'
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        <p
          className='text-xs text-center text-gray-400 cursor-pointer underline'
          onClick={() => navigate("/login")}
        >
          Back to Login
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword