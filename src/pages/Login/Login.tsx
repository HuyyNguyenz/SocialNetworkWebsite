import { useNavigate } from 'react-router-dom'
import LoginForm from '~/components/LoginForm'
import { useEffect, useState } from 'react'
import useCookie from '~/hooks/useCookie'
import LoginLayout from '~/layouts/LoginLayout'

export default function Login() {
  const [, getCookie] = useCookie()
  const refreshToken = getCookie('refreshToken')
  const [isLogout] = useState<boolean>(!refreshToken)
  const navigate = useNavigate()

  useEffect(() => {
    if (refreshToken) {
      navigate('/')
    }
  }, [refreshToken, navigate])

  return (
    <>
      {isLogout && (
        <LoginLayout>
          <LoginForm />
        </LoginLayout>
      )}
    </>
  )
}
