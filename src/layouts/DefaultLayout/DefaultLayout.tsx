import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '~/components/Header'
import useCookie from '~/hooks/useCookie'

interface Props {
  children: React.ReactNode
}

export default function DefaultLayout(props: Props) {
  const { children } = props
  const { getCookie } = useCookie()
  const refreshToken = getCookie('refreshToken')
  const [isLogin] = useState<boolean>(!!refreshToken)
  const navigate = useNavigate()

  useEffect(() => {
    if (!refreshToken) {
      navigate('/login')
    }
  }, [refreshToken, navigate])
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
