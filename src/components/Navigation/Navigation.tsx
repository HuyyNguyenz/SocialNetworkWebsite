import { NavLink } from 'react-router-dom'

export default function Navigation() {
  return (
    <div>
      <ul className='flex items-center justify-center text-text-color text-18 bg-white border-b border-solid border-border-color h-14 max-h-14'>
        <NavLink to='/'>
          <li className='relative w-32 text-center mx-8 cursor-pointer hover:text-primary-color transition-all ease-linear duration-200'>
            <span>Trang chủ</span>
            <div className='w-32 h-[0.125rem] bg-primary-color absolute bottom-[-14px] left-0 hidden' />
          </li>
        </NavLink>
        <NavLink to='/friends'>
          <li className='relative w-32 text-center mx-8 cursor-pointer hover:text-primary-color transition-all ease-linear duration-200'>
            <span>Bạn bè</span>
            <div className='w-32 h-[0.125rem] bg-primary-color absolute bottom-[-14px] left-0 hidden' />
          </li>
        </NavLink>
        <NavLink to='/communities'>
          <li className='relative w-32 text-center mx-8 cursor-pointer hover:text-primary-color transition-all ease-linear duration-200'>
            <span>Nhóm</span>
            <div className='w-32 h-[0.125rem] bg-primary-color absolute bottom-[-14px] left-0 hidden' />
          </li>
        </NavLink>
        <NavLink to='/videos'>
          <li className='relative w-32 text-center mx-8 cursor-pointer hover:text-primary-color transition-all ease-linear duration-200'>
            <span>Videos</span>
            <div className='w-32 h-[0.125rem] bg-primary-color absolute bottom-[-14px] left-0 hidden' />
          </li>
        </NavLink>
      </ul>
    </div>
  )
}
