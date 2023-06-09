import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import logo from '~/assets/images/Social-removebg-preview.png'

interface Props {
  children: React.ReactNode
}

export default function LoginLayout(props: Props) {
  const { children } = props
  return (
    <div>
      <div className='font-inter relative w-screen min-h-screen bg-gradient-to-br from-primary-color to-secondary-color'>
        <div className='bg-white center flex flex-col-reverse rounded-2xl overflow-hidden lg:flex-row lg:items-center lg:justify-center'>
          <div className='bg-white lg:bg-hover-color'>
            <div className='min-w-[25rem] min-h-[25rem] hidden lg:block'>
              <img loading='lazy' src={logo} alt='logo_social' />
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
          {children}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
