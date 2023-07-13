import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import fetchApi from '~/utils/fetchApi'

export default function VerifyRegister() {
  const { username } = useParams()
  const [description, setDescription] = useState<string>('Đang xử lý')

  useEffect(() => {
    if (username) {
      const controller = new AbortController()
      fetchApi
        .put(`verifyUser/${username}`, { signal: controller.signal })
        .then((res) => {
          setDescription(res.data.message)
        })
        .catch((error) => error.name !== 'CanceledError' && console.log(error))
      return () => {
        controller.abort()
      }
    }
  }, [username])

  return (
    <div className='w-full relative min-h-screen bg-gradient-to-br from-primary-color to-secondary-color'>
      <div className='center text-white text-center text-32'>
        <div>
          <h1 className='font-black uppercase'>Xác thực email</h1>
          <span className='text-28'>{description}</span>
        </div>
      </div>
    </div>
  )
}
