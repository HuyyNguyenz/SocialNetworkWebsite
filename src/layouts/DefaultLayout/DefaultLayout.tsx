import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '~/components/Header'
import useCookie from '~/hooks/useCookie'
import fetchApi from '~/utils/fetchApi'
import useRefreshToken from '~/hooks/useRefreshToken'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '~/features/userData/userDataSlice'
import { RootState } from '~/store'

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
  const handleRefreshToken = useRefreshToken

  useEffect(() => {
    if (!isLogin) {
      navigate('/login')
    }
  }, [isLogin, navigate])

  useEffect(() => {
    const controller = new AbortController()
    const handleGetUserData = async () => {
      const accessToken = getCookie('accessToken') as string
      const refreshToken = getCookie('refreshToken') as string
      try {
        const result = (
          await fetchApi.get('user', { headers: { token: `Bearer ${accessToken}` }, signal: controller.signal })
        ).data
        dispatch(setUserData(result))
      } catch (error: any) {
        if (error.response.data === 'Token is not valid') {
          handleRefreshToken(handleGetUserData, refreshToken)
        }
      }
    }
    if (userData.email === '') {
      handleGetUserData()
    }
    return () => {
      controller.abort()
    }
  }, [dispatch, getCookie, handleRefreshToken, userData])

  return (
    <>
      {isLogin && (
        <div className='font-inter bg-bg-input-color '>
          <Header />

          {children}
        </div>
      )}
    </>
  )
}
