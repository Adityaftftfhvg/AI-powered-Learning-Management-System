import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import EditCourse from './pages/Educator/EditCourse'
import Login from './pages/Login'
import Profile from './pages/Profile'
export const serverUrl = ""
import { ToastContainer } from "react-toastify"
import getCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import ForgotPassword from './pages/ForgotPassword'
import EditProfile from './pages/EditProfile'
import Courses from './pages/Educator/Courses'
import Dashboard from './pages/Educator/Dashboard'
import CreateCourse from './pages/Educator/CreateCourses'
import AllCourses from './pages/AllCourses'
import CourseDetail from './pages/CourseDetail'
import WatchCourse from './pages/WatchCourse'
import ManageLectures from './pages/Educator/ManageLectures'
import MockInterview from './pages/MockInterview'
import MyLearning from './pages/MyLearning'
import Certificates from './pages/Certificates'
import Practice from './pages/Practice'
import ResumeReview from './pages/ResumeReview'

function App() {
  const loading = getCurrentUser()
   const { userData } = useSelector(state => state.user)

     if (loading) return <div className='w-[100vw] h-[100vh] flex items-center justify-center text-[20px]'>Loading...</div>

  return (
 <BrowserRouter>
      <ToastContainer />
  
     <Routes>
        <Route path='/' element={<Home />} />
     <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/profile" />} />
      <Route path='/login' element={!userData ? <Login /> : <Navigate to="/profile" />} />
  <Route path='/profile' element={userData ? <Profile /> : <Navigate to="/login" />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
     <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to="/signup" />} />
    <Route path='/dashboard' element={userData?.role === "Educator" ? <Dashboard /> : <Navigate to="/signup" />} />
       <Route path='/courses' element={userData?.role === "Educator" ? <Courses /> : <Navigate to="/signup" />} />
 <Route path='/createcourses' element={userData?.role === "Educator" ? <CreateCourse /> : <Navigate to="/signup" />} />
        <Route path='/editcourse/:courseId' element={userData?.role === "Educator" ? <EditCourse /> : <Navigate to="/signup" />} />
      <Route path='/managelectures/:courseId' element={userData?.role === "Educator" ? <ManageLectures /> : <Navigate to="/signup" />} />
        <Route path='/allcourses' element={userData ? <AllCourses /> : <Navigate to="/login" />} />
       <Route path='/coursedetail/:courseId' element={userData ? <CourseDetail /> : <Navigate to="/login" />} />
   <Route path='/watchcourse/:courseId' element={userData ? <WatchCourse /> : <Navigate to="/login" />} />
         <Route path='/mockinterview' element={userData ? <MockInterview /> : <Navigate to="/login" />} />
        <Route path='/mylearning' element={userData ? <MyLearning /> : <Navigate to="/login" />} />
        <Route path='/certificates' element={userData ? <Certificates /> : <Navigate to="/login" />} />
        <Route path='/practice' element={userData ? <Practice /> : <Navigate to="/login" />} />
        <Route path='/resumereview' element={userData ? <ResumeReview /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
