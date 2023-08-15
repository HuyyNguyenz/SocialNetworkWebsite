import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '~/components/Header'
import useCookie from '~/hooks/useCookie'
import fetchApi from '~/utils/fetchApi'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '~/features/userData/userDataSlice'
import { RootState } from '~/store'
import { ToastContainer } from 'react-toastify'
import VideoCall from '~/components/VideoCall'
import socket from '~/socket'
import { User } from '~/types'

interface Props {
  children: React.ReactNode
}

export default function DefaultLayout(props: Props) {
  const { children } = props
  const [, getCookie] = useCookie()
  const [isLogin] = useState<boolean>(() => !!getCookie('refreshToken'))
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userData = useSelector((state: RootState) => state.userData.data)
  const [isOpen, setOpen] = useState<boolean>(false)
  const [caller, setCaller] = useState<User | null>(null)
  const [userCalled, setUserCalled] = useState<User | null>(null)

  const handleCallCancelled = () => {
    setCaller(null)
    setUserCalled(null)
    setOpen(false)
    document.body.classList.remove('overflow-hidden')
    window.location.reload()
  }

  useEffect(() => {
    if (!isLogin) {
      navigate('/login')
    }
  }, [isLogin, navigate])

  useEffect(() => {
    const controller = new AbortController()
    const handleGetUserData = async () => {
      try {
        const result = (await fetchApi.get(`user/${getCookie('refreshToken')}`, { signal: controller.signal })).data
        dispatch(setUserData(result))
      } catch (error: any) {
        error.name !== 'CanceledError' && console.log(error)
      }
    }

    if (userData.email === '') {
      handleGetUserData()
    }

    return () => {
      controller.abort()
    }
  }, [dispatch, userData, getCookie])

  useEffect(() => {
    socket.on('receiveCall', (data) => {
      !isOpen && setOpen(true)
      caller === null && setCaller(data.caller)
    })
    socket.on('pendingStatusCall', (data) => {
      !isOpen && setOpen(true)
      userCalled === null && setUserCalled(data.receiver)
      document.body.classList.add('overflow-hidden')
    })
  }, [isOpen, caller, userCalled])

  return (
    <>
      {isLogin && (
        <div className='font-inter bg-input-color dark:bg-dark-input-color min-h-screen'>
          <Header />
          {children}
          <ToastContainer />
          {isOpen && (
            <VideoCall
              caller={caller}
              userCalled={userCalled}
              canceled={(isCancelled) => isCancelled && handleCallCancelled()}
            />
          )}
        </div>
      )}
    </>
  )
}
