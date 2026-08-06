import axios from 'axios'
import { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const getCurrentUser = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/getcurrentuser", { withCredentials: true })
        dispatch(setUserData(result.data))
      } catch (error) {
        console.log(error)
        dispatch(setUserData(null))
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  return loading
}

export default getCurrentUser