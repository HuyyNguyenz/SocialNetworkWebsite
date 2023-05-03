import logo from '~/assets/images/Social-removebg-preview.png'
import { Link, useNavigate } from 'react-router-dom'
import LoginForm from '~/components/LoginForm'
import { ToastContainer } from 'react-toastify'
import { useEffect, useState } from 'react'
import useCookie from '~/hooks/useCookie'

export default function Login() {
  const { getCookie } = useCookie()
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
        <>
          <div className='font-inter relative w-screen min-h-screen bg-gradient-to-br from-primary-color to-secondary-color'>
            <div className='bg-white center flex flex-col-reverse rounded-2xl overflow-hidden lg:flex-row lg:items-center lg:justify-center'>
              <div className='bg-white lg:bg-eeeeee-color'>
                <div className='min-w-[25rem] min-h-[25rem] hidden lg:block'>
                  <img src={logo} alt='logo_social' />
                </div>
                <div className='flex flex-col items-start justify-start mb-8 ml-8 text-14'>
                  <span>Chưa có tài khoản ?</span>
                  <Link to='/register'>
                    <span className='bg-gradient-to-r from-primary-color to-secondary-color bg-clip-text text-transparent font-bold'>
                      Đăng ký
                    </span>
                  </Link>
                </div>
              </div>
              <LoginForm />
            </div>
          </div>
          <ToastContainer />
        </>
      )}
    </>
  )
}
