import logo from '~/assets/images/Social-removebg-preview.png'
import RegisterForm from '~/components/RegisterForm'

export default function Register() {
  return (
    <div className='font-inter relative w-screen h-screen bg-gradient-to-br from-primary-color to-secondary-color'>
      <div className='bg-white center flex items-start justify-start rounded-2xl overflow-hidden'>
        <div className='bg-eeeeee-color'>
          <div className='min-w-[28.125rem] min-h-[28.125rem]'>
            <img src={logo} alt='logo_social' />
          </div>
          <div className='flex flex-col items-start justify-start mb-8 ml-8 text-14'>
            <span>Đã có tài khoản ?</span>
            <button>
              <span className='bg-gradient-to-r from-primary-color to-secondary-color bg-clip-text text-transparent font-bold'>
                Đăng nhập
              </span>
            </button>
          </div>
        </div>
        <div>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
