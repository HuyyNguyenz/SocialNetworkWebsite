import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useCookie from '~/hooks/useCookie'

interface Props {
  children: React.ReactNode
}

export default function DefaultLayout(props: Props) {
  const { children } = props
  const [isLogin, setLogin] = useState<boolean>(false)
  const { getCookie } = useCookie()
  const navigate = useNavigate()

  useEffect(() => {
    const refreshToken = getCookie('refreshToken')
    if (refreshToken) {
      setLogin(true)
    } else {
      navigate('/login')
    }
  }, [getCookie, navigate])
  return <>{isLogin && <div>DefaultLayout {children} </div>}</>
}
