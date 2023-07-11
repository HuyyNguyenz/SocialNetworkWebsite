import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '~/components/Header'
import useCookie from '~/hooks/useCookie'
import fetchApi from '~/utils/fetchApi'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '~/features/userData/userDataSlice'
import { RootState } from '~/store'
import { ToastContainer } from 'react-toastify'

interface Props {
  children: React.ReactNode
}

export default function DefaultLayout(props: Props) {
  const { children } = props
  const [, getCookie] = useCookie()
  const [isLogin] = useState<boolean>(() => !!getCookie('refreshToken'))
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userData = useSelector((state: RootState) => state.userData)

  useEffect(() => {
    if (!isLogin) {
      navigate('/login')
    }
  }, [isLogin, navigate])

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const handleGetUserData = async () => {
      try {
        const result = (await fetchApi.get('user', { signal })).data
        dispatch(setUserData(result))
      } catch (error: any) {
        throw error.response
      }
    }

    if (userData.email === '') {
      handleGetUserData()
    }

    return () => {
      controller.abort()
    }
  }, [dispatch, userData])

  return (
    <>
      {isLogin && (
        <div className='font-inter bg-input-color dark:bg-dark-input-color min-h-screen'>
          <Header />
          {children}
          <ToastContainer />
        </div>
      )}
    </>
  )
}
