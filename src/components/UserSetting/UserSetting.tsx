import { useState } from 'react'
import userImg from '~/assets/images/user.png'
import Tippy from '@tippyjs/react/headless'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faMoon, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import useCookie from '~/hooks/useCookie'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeUserData } from '~/features/userData/userDataSlice'
import { RootState } from '~/store'

export default function UserSetting() {
  const [isOpen, setOpen] = useState<boolean>(false)
  const [, , removeCookie] = useCookie()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userData = useSelector((state: RootState) => state.userData)

  const handleOpenMenu = () => {
    setOpen((prev) => !prev)
  }

  const handleLogout = () => {
    removeCookie('accessToken')
    removeCookie('refreshToken')
    localStorage.removeItem('remember')
    dispatch(removeUserData())
    navigate('/login')
  }

  return (
    <Tippy
      onClickOutside={() => setOpen(false)}
      visible={isOpen}
      interactive
      placement='bottom-start'
      render={(attrs) => (
        <div
          className='bg-white shadow-lg w-[18.75rem] rounded-md animate-fade overflow-hidden'
          tabIndex={-1}
          {...attrs}
        >
          <ul className='text-14'>
            <Link to={`/profile/${userData.username}/posts`}>
              <li className='flex items-center justify-start py-2 px-4 my-2 cursor-pointer'>
                <img
                  loading='lazy'
                  className='w-8 h-8 object-cover rounded-md'
                  src={userData.avatar ? userData.avatar.url : userImg}
                  alt={userData.firstName + ' ' + userData.lastName}
                />
                <span className='text-18 font-semibold ml-2 line-clamp-1'>{`${userData.firstName} ${userData.lastName}`}</span>
              </li>
            </Link>
            <li className='flex items-center justify-start py-2 px-4 my-2 cursor-pointer hover:bg-hover-color'>
              <FontAwesomeIcon icon={faGear} />
              <span className='ml-2'>Cài đặt chung</span>
            </li>
            <li className='py-2 px-4 my-2 cursor-pointer hover:bg-hover-color'>
              <button className='flex items-center justify-start w-full'>
                <FontAwesomeIcon icon={faMoon} />
                <span className='ml-2'>Chế độ tối</span>
              </button>
            </li>
            <li className='py-2 px-4 my-2 cursor-pointer hover:bg-hover-color'>
              <button onClick={handleLogout} className='flex items-center justify-start w-full'>
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span className='ml-2'>Đăng xuất</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    >
      <button onClick={handleOpenMenu}>
        <img
          loading='lazy'
          src={userData.avatar ? userData.avatar.url : userImg}
          alt={userData.firstName + ' ' + userData.lastName}
          className='w-9 h-9 ml-4 rounded-md object-cover cursor-pointer'
        />
      </button>
    </Tippy>
  )
}
