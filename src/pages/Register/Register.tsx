import logo from '~/assets/images/Social-removebg-preview.png'
import RegisterForm from '~/components/RegisterForm'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import useCookie from '~/hooks/useCookie'
import { useEffect, useState } from 'react'

export default function Register() {
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
          <div className='font-inter relative w-full min-h-screen bg-gradient-to-br from-primary-color to-secondary-color'>
            <div className='bg-white center flex flex-col-reverse rounded-2xl overflow-hidden lg:flex-row lg:items-start lg:justify-start'>
              <div className='bg-white lg:bg-eeeeee-color'>
                <div className='min-w-[28.125rem] min-h-[28.125rem] hidden lg:block'>
                  <img src={logo} alt='logo_social' />
                </div>
                <div className='flex flex-col items-start justify-start mb-8 ml-8 text-14'>
                  <span>Đã có tài khoản ?</span>
                  <Link to='/login'>
                    <span className='bg-gradient-to-r from-primary-color to-secondary-color bg-clip-text text-transparent font-bold'>
                      Đăng nhập
                    </span>
                  </Link>
                </div>
              </div>
              <RegisterForm />
            </div>
          </div>
          <ToastContainer />
        </>
      )}
    </>
  )
}
