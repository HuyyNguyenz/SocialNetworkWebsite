import { NavLink } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='w-full relative min-h-screen bg-gradient-to-br from-primary-color to-secondary-color'>
      <div className='center text-white text-center text-32'>
        <div>
          <h1 className='font-black'>Lỗi 404</h1>
          <span className='text-28'>Không tìm thấy trang</span>
        </div>
        <NavLink to='/'>
          <button className='text-18 bg-white text-title-color font-bold rounded-md p-2 hover:text-secondary-color transition-all ease-linear duration-150'>
            Quay về trang chủ
          </button>
        </NavLink>
      </div>
    </div>
  )
}
