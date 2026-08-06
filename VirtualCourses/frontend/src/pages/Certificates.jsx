import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { serverUrl } from '../App'
import { FaArrowLeft, FaCertificate, FaPrint } from 'react-icons/fa'

function Certificates() {
  const navigate = useNavigate()
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/certificate/my", { withCredentials: true })
        setCertificates(result.data)
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || "Failed to load certificates")
      } finally {
        setLoading(false)
      }
    }
    fetchCerts()
  }, [])

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='px-4 md:px-8 py-4 bg-white border-b flex items-center justify-between print:hidden'>
        <button
          className='text-sm text-gray-600 hover:text-black flex items-center gap-1'
          onClick={() => navigate("/mylearning")}
        >
          <FaArrowLeft /> My Certificates
        </button>
      </div>

      <div className='max-w-4xl mx-auto p-4 md:p-8 print:hidden'>
        {loading ? (
          <p className='text-gray-400 text-sm'>Loading...</p>
        ) : certificates.length === 0 ? (
          <p className='text-gray-400 text-sm'>Complete a course to earn your first certificate.</p>
        ) : (
          <div className='grid sm:grid-cols-2 gap-4'>
            {certificates.map((cert) => (
              <div key={cert._id} className='bg-white rounded-lg shadow p-5 flex flex-col gap-2'>
                <FaCertificate className='text-[#03394b] text-2xl' />
                <p className='font-semibold text-sm'>{cert.course?.title}</p>
                <p className='text-xs text-gray-400'>Certificate ID: {cert.certificateId}</p>
                <p className='text-xs text-gray-400'>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                <button
                  className='mt-2 px-4 py-2 rounded-full bg-[#03394b] text-white text-xs font-medium hover:opacity-90 transition-opacity self-start'
                  onClick={() => setSelected(cert)}
                >
                  View Certificate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-20 print:static print:bg-white print:p-0'>
          <div className='bg-white rounded-lg max-w-2xl w-full p-10 relative print:shadow-none print:rounded-none'>
            <button
              className='absolute top-4 right-4 text-gray-400 hover:text-black text-sm print:hidden'
              onClick={() => setSelected(null)}
            >
              Close
            </button>
            <div className='border-4 border-[#03394b] p-10 text-center'>
              <p className='text-xs tracking-widest text-gray-400 mb-2'>CERTIFICATE OF COMPLETION</p>
              <h1 className='text-2xl font-bold text-[#03394b] mb-6'>{selected.course?.title}</h1>
              <p className='text-sm text-gray-500'>This certifies that</p>
              <p className='text-xl font-semibold my-2'>{selected.user?.name}</p>
              <p className='text-sm text-gray-500'>has successfully completed the course</p>
              <p className='text-xs text-gray-400 mt-8'>Certificate ID: {selected.certificateId}</p>
              <p className='text-xs text-gray-400'>
                Issued on {new Date(selected.issuedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              className='mt-6 mx-auto flex items-center gap-2 px-5 py-2 rounded-full bg-[#03394b] text-white text-sm font-medium hover:opacity-90 transition-opacity print:hidden'
              onClick={() => window.print()}
            >
              <FaPrint /> Print / Save as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Certificates