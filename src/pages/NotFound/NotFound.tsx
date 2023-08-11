import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function NotFound() {
  const [info, setInfo] = useState<{ title: string; message: string }>({
    title: 'Lỗi 404',
    message: 'Không tìm thấy trang'
  })

  useEffect(() => {
    window.location.href.includes('communities') &&
      setInfo({ title: 'Thông báo', message: 'Chức năng đang được hoàn thiện 😊' })
    window.location.href.includes('deleted') &&
      setInfo({ title: 'Thông báo', message: 'Bài viết không còn tồn tại ❌' })
  }, [])

  return (
    <div className='w-full relative min-h-screen bg-gradient-to-br from-primary-color to-secondary-color'>
      <div className='center w-full text-white text-center text-32'>
        <div>
          <h1 className='font-black uppercase'>{info.title}</h1>
          <span className='text-22'>{info.message}</span>
        </div>
        <NavLink to='/'>
          <button className='text-18 bg-bg-light text-title-color font-bold rounded-md p-2 hover:text-secondary-color transition-all ease-linear duration-150'>
            Quay về trang chủ
          </button>
        </NavLink>
      </div>
    </div>
  )
}
