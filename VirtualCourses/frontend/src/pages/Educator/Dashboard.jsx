import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Chart } from 'chart.js/auto'
import axios from 'axios'
import { toast } from 'react-toastify'
import { serverUrl } from '../../App'

const TAG_STYLES = {
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-green-50 text-green-700',
  gray: 'bg-gray-100 text-gray-500',
}

function MetricCard({ label, value, sub, subGood = true }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
   <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-medium text-gray-900">{value}</p>
     <p className={`text-xs mt-1 ${subGood ? 'text-emerald-500' : 'text-rose-400'}`}>{sub}</p>
    </div>
  )
}

function BarChart({ canvasId, data, color, labels }) {
 const chartRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return
    instanceRef.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
      data,
        backgroundColor: color,
   borderRadius: { topLeft: 4, topRight: 4 },
       borderSkipped: false,
     maxBarThickness: 32,
        }],
      },
      options: {
        responsive: true,
      maintainAspectRatio: false,
    plugins: { legend: { display: false } },
       scales: {
          x: {
           grid: { display: false },
        border: { display: false },
            ticks: { color: '#9ca3af', font: { size: 11 } },
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.05)' },
          border: { display: false },
       ticks: { color: '#9ca3af', font: { size: 11 }, stepSize: 1 },
            beginAtZero: true,
          },
        },
      },
    })
  return () => instanceRef.current?.destroy()
  }, [data, labels])

  return (
    <div style={{ position: 'relative', width: '100%', height: 180 }}>
      <canvas ref={chartRef} id={canvasId} />
    </div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)

  const [stats, setStats] = useState(null)
 const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
   const result = await axios.get(serverUrl + "/api/course/educator/stats", { withCredentials: true })
      setStats(result.data)
      } catch (error) {
    console.log(error)
        toast.error(error?.response?.data?.message || "Failed to load dashboard stats")
      } finally {
    setLoading(false)
      }
    }
  fetchStats()
  }, [])

  const name = userData?.name || 'Educator'
  const role = userData?.role || 'Educator'
 const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-gray-400">Loading dashboard...</div>
  }

 const courses = stats?.courses || []
  const avgEnrolment = courses.length ? (stats.totalStudents / courses.length).toFixed(1) : '0'
  const shortLabels = courses.map((c) => c.title.length > 12 ? c.title.slice(0, 12) + '…' : c.title)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">

      <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
        <div
       className="w-16 h-16 rounded-full flex items-center justify-center text-white font-medium text-xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #2a78d6 0%, #1baf7a 100%)' }}
        >
          {initials}
     </div>
        <div className="flex-1">
          <h1 className="text-xl font-medium text-gray-900">Welcome, {name} 👋</h1>
   <p className="text-sm text-gray-400 mt-0.5">{role} · Instructor</p>
        </div>
        <div className="flex flex-col items-end gap-3">
      <div className="text-right">
         <p className="text-xs text-gray-400 uppercase tracking-wide">Total earnings</p>
            <p className="text-2xl font-medium text-gray-900">₹{(stats?.totalEarnings || 0).toLocaleString('en-IN')}</p>
          </div>
          <button
       onClick={() => navigate('/createcourses')}
            className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            + Create course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Total courses" value={stats?.totalCourses || 0} sub="Active" />
    <MetricCard label="Total lectures" value={stats?.totalLectures || 0} sub="Across all courses" />
       <MetricCard label="Total students" value={stats?.totalStudents || 0} sub="Unique enrolments" />
  <MetricCard label="Avg. enrolment" value={avgEnrolment} sub="per course" subGood={false} />
      </div>

      {courses.length === 0 ? (
  <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center text-gray-400 text-sm">
      You haven't created any courses yet. Once you do, your stats and charts will show up here.
        </div>
      ) : (
        <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wide">Course progress · lectures</p>
              <BarChart
              canvasId="lecturesChart"
         data={courses.map((c) => c.lectures)}
                labels={shortLabels}
             color="#2a78d6"
              />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wide">Student enrolment</p>
              <BarChart
               canvasId="enrollChart"
           data={courses.map((c) => c.students)}
                labels={shortLabels}
             color="#1baf7a"
              />
            </div>
          </div>

     <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Your courses</p>
              <button
                onClick={() => navigate('/courses')}
                className="text-xs text-blue-600 hover:underline"
              >
                See all →
         </button>
            </div>
            <div className="flex flex-col divide-y divide-gray-50">
   {courses.map((course) => (
                <div key={course.id} className="flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-lg flex-shrink-0">
                    📘
          </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
             {course.lectures} lecture{course.lectures !== 1 ? 's' : ''} ·{' '}
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${TAG_STYLES[course.isPublished ? 'green' : 'gray']}`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
         </p>
                  </div>
                  <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{course.students} student{course.students !== 1 ? 's' : ''}</p>
                   <p className="text-xs text-gray-400">enrolled</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  )
}

export default Dashboard