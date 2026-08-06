import React, { useState } from 'react'
import logo from "../assets/logo.jpg"
import { IoPersonCircleSharp } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ImCross } from "react-icons/im";
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';

function Nav({ user }) {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [showHam, setShowHam] = useState(false)

      const handleLogOut = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      dispatch(setUserData(null))
   console.log(result.data)
        toast.success(result.data)
    } catch (error) {
          console.log(error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <div>
       <div className='w-[100%] h-[70px] fixed top-0 p-[20px] py-[10px] flex items-center justify-between bg-[#0000002e] backdrop-blur-md border-b border-white/10 z-10'>

        <div className="lg:w-[20%] w-[40%] lg:pl-[50px]">
             <img src={logo} alt="" className='w-[55px] rounded-[8px] border-2 border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.25)] cursor-pointer transition-transform hover:scale-105' onClick={() => navigate("/")} />
        </div>

    <div className='w-[30%] lg:flex items-center justify-center gap-3 hidden'>
              {!userData && (
            <IoPersonCircleSharp
              className='w-[46px] h-[46px] fill-white/90 cursor-pointer hover:fill-white transition-colors'
              onClick={() => setShow(prev => !prev)}
            />
          )}
          {userData && (
            <div
              className='w-[44px] h-[44px] rounded-full text-white flex items-center justify-center text-[18px] font-medium bg-[#03394b] ring-2 ring-white/70 ring-offset-2 ring-offset-transparent cursor-pointer transition-transform hover:scale-105'
              onClick={() => setShow(prev => !prev)}
         >
              {userData?.name?.slice(0, 1).toUpperCase()}
            </div>
          )}

          <div
               className='px-[16px] py-[8px] bg-white/10 border border-white/25 text-white rounded-full text-[15px] font-medium tracking-wide cursor-pointer backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/40'
            onClick={() => navigate("/mockinterview")}
          >
            Mock Interview
      </div>

              {userData?.role === "Educator" && (
            <div
              className='px-[16px] py-[8px] bg-white/10 border border-white/25 text-white rounded-full text-[15px] font-medium tracking-wide cursor-pointer backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/40'
          onClick={() => navigate("/dashboard")}
            >
              Dashboard
        </div>
          )}

             {userData ? (
            <span
           className='px-[16px] py-[8px] bg-white text-[#03394b] rounded-full text-[15px] font-semibold cursor-pointer transition-all hover:bg-white/90 hover:shadow-[0_2px_12px_rgba(255,255,255,0.3)]'
              onClick={handleLogOut}
            >
              Logout
            </span>
          ) : (
               <span
              className='px-[16px] py-[8px] bg-[#03394b] text-white rounded-full text-[15px] font-semibold cursor-pointer transition-all hover:bg-[#04506a]'
                 onClick={() => navigate("/login")}
            >
           Login
            </span>
          )}

          {show && (
            <div className='absolute top-[120%] right-[10%] flex flex-col gap-1.5 text-[15px] rounded-[14px] bg-white/95 backdrop-blur-md px-[10px] py-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.25)] border border-black/5 min-w-[170px]'>
              <span
                  className='text-[#1a1a1a] px-[16px] py-[10px] rounded-[10px] font-medium transition-colors hover:bg-[#03394b] hover:text-white cursor-pointer'
                onClick={() => { navigate("/profile"); setShow(false) }}
              >
             My profile
              </span>
              <span
                className='text-[#1a1a1a] px-[16px] py-[10px] rounded-[10px] font-medium transition-colors hover:bg-[#03394b] hover:text-white cursor-pointer'
          onClick={() => { navigate("/courses"); setShow(false) }}
              >
                My courses
        </span>
             <span
                className='text-[#1a1a1a] px-[16px] py-[10px] rounded-[10px] font-medium transition-colors hover:bg-[#03394b] hover:text-white cursor-pointer'
                onClick={() => { navigate("/mylearning"); setShow(false) }}
              >
                My learning
              </span>
              <span
                className='text-[#1a1a1a] px-[16px] py-[10px] rounded-[10px] font-medium transition-colors hover:bg-[#03394b] hover:text-white cursor-pointer'
                onClick={() => { navigate("/certificates"); setShow(false) }}
              >
                Certificates
              </span>
              <span
                className='text-[#1a1a1a] px-[16px] py-[10px] rounded-[10px] font-medium transition-colors hover:bg-[#03394b] hover:text-white cursor-pointer'
                onClick={() => { navigate("/practice"); setShow(false) }}
              >
                Practice
              </span>
              <span
                className='text-[#1a1a1a] px-[16px] py-[10px] rounded-[10px] font-medium transition-colors hover:bg-[#03394b] hover:text-white cursor-pointer'
                onClick={() => { navigate("/resumereview"); setShow(false) }}
              >
                Resume Review
              </span>
            </div>
          )}
           </div>

        <GiHamburgerMenu
       className='w-[32px] h-[32px] lg:hidden fill-white cursor-pointer transition-transform hover:scale-110'
          onClick={() => setShowHam(prev => !prev)}
        />

        <div
              className={`fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#0a0a0acc] backdrop-blur-xl flex items-center justify-center flex-col gap-4 z-10 lg:hidden transition-all duration-500 ${
            showHam ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <ImCross
            className='w-[30px] h-[30px] fill-white/80 absolute top-6 right-[6%] cursor-pointer hover:fill-white transition-colors'
         onClick={() => setShowHam(prev => !prev)}
          />

             {!userData && <IoPersonCircleSharp className='w-[54px] h-[54px] fill-white/90 mb-2' />}
          {userData && (
          <div className='w-[54px] h-[54px] rounded-full text-white flex items-center justify-center text-[22px] font-medium bg-[#03394b] ring-2 ring-white/70 mb-2'>
                 {userData?.name?.slice(0, 1).toUpperCase()}
            </div>
          )}

          {[
            { label: "Mock Interview", path: "/mockinterview", show: true },
          { label: "My profile", path: "/profile", show: true },
        { label: "My courses", path: "/courses", show: true },
            { label: "My learning", path: "/mylearning", show: !!userData },
            { label: "Certificates", path: "/certificates", show: !!userData },
            { label: "Practice", path: "/practice", show: !!userData },
            { label: "Resume Review", path: "/resumereview", show: !!userData },
               { label: "Dashboard", path: "/dashboard", show: userData?.role === "Educator" },
          ].filter(item => item.show).map((item, i) => (
            <div
             key={item.label}
                style={{ transitionDelay: showHam ? `${i * 60}ms` : "0ms" }}
           className={`px-[24px] py-[10px] w-[220px] text-center bg-white/10 border border-white/20 backdrop-blur-sm text-white rounded-full text-[16px] font-medium cursor-pointer transition-all duration-300 hover:bg-white/20 ${
                showHam ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
                  onClick={() => { navigate(item.path); setShowHam(false) }}
            >
              {item.label}
         </div>
          ))}

              {userData ? (
            <span
              style={{ transitionDelay: showHam ? "240ms" : "0ms" }}
          className={`px-[24px] py-[10px] w-[220px] text-center bg-white text-[#03394b] rounded-full text-[16px] font-semibold flex justify-center cursor-pointer transition-all duration-300 ${
                showHam ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
                 onClick={handleLogOut}
            >
           Logout
            </span>
          ) : (
         <span
              style={{ transitionDelay: showHam ? "240ms" : "0ms" }}
                   className={`px-[24px] py-[10px] w-[220px] text-center bg-[#03394b] text-white rounded-full text-[16px] font-semibold flex justify-center cursor-pointer transition-all duration-300 ${
                showHam ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
       onClick={() => { navigate("/login"); setShowHam(false) }}
            >
           Login
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Nav