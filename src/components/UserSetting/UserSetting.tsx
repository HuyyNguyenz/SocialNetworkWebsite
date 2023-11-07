import { useEffect, useState } from 'react'
import userImg from '~/assets/images/user.png'
import Tippy from '@tippyjs/react/headless'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faGear, faMoon, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import useCookie from '~/hooks/useCookie'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import socket from '~/utils/socket'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { removeUserData } from '~/features/userData/userDataSlice'
import fetchApi from '~/utils/fetchApi'

export default function UserSetting() {
  const [isOpen, setOpen] = useState<boolean>(false)
  const [, getCookie, removeCookie] = useCookie()
  const navigate = useNavigate()
  const userData = useSelector((state: RootState) => state.userData.data)
  const [isDarkMode, setDarkMode] = useState<boolean>(false)
  const dispatch = useDispatch()

  const handleOpenMenu = () => {
    setOpen((prev) => !prev)
  }

  const handleLogout = async () => {
    const refreshToken = getCookie('refreshToken') as string
    const result = (await fetchApi.post('logout', { refreshToken })).data
    if (result.message) {
      removeCookie('accessToken')
      removeCookie('refreshToken')
      dispatch(removeUserData())
      localStorage.removeItem('remember')
      socket.emit('sendRequestOfflineClient', { userId: userData.id })
      navigate('/login')
    }
  }

  const handleToggleDarkMode = () => {
    if (localStorage.getItem('theme') === 'dark') {
      localStorage.setItem('theme', 'light')
      document.body.classList.remove('dark')
      setDarkMode(false)
    } else {
      localStorage.setItem('theme', 'dark')
      document.body.classList.add('dark')
      setDarkMode(true)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark')
      setDarkMode(true)
    } else {
      document.body.classList.remove('dark')
      setDarkMode(false)
    }
  }, [])

  return (
    <Tippy
      onClickOutside={() => setOpen(false)}
      visible={isOpen}
      interactive
      placement='bottom-start'
      render={(attrs) => (
        <div
          className='bg-bg-light dark:bg-bg-dark dark:text-dark-text-color border border-solid border-border-color dark:border-dark-border-color shadow-lg w-[18.75rem] rounded-md animate-fade overflow-hidden'
          tabIndex={-1}
          {...attrs}
        >
          <ul className='text-14'>
            <Link to={`/${userData.username}/profile/${userData.id}/posts`}>
              <li className='flex items-center justify-start py-2 px-4 my-2 cursor-pointer'>
                <LazyLoadImage
                  placeholderSrc={userImg}
                  effect='blur'
                  width={'2rem'}
                  height={'2rem'}
                  className={`w-8 h-8 object-cover rounded-md`}
                  src={userData.avatar ? userData.avatar.url : userImg}
                  alt={userData.firstName + ' ' + userData.lastName}
                />
                <span className='text-18 dark:text-dark-title-color font-semibold ml-2 line-clamp-1'>{`${userData.firstName} ${userData.lastName}`}</span>
              </li>
            </Link>
            <NavLink to={`/${userData.username}/setting`}>
              <li className='flex items-center justify-start py-2 px-4 my-2 cursor-pointer hover:bg-hover-color dark:hover:bg-dark-hover-color'>
                <FontAwesomeIcon icon={faGear} />
                <span className='ml-2'>Cài đặt chung</span>
              </li>
            </NavLink>
            <li className='flex items-center justify-between py-2 px-4 my-2 select-none'>
              <div className='flex items-center justify-start w-full'>
                <FontAwesomeIcon icon={faMoon} />
                <span className='ml-2'>Chế độ tối</span>
              </div>
              <button
                onClick={handleToggleDarkMode}
                className={`relative bg-dark-title-color ${
                  isDarkMode ? 'dark:bg-dark-primary-color' : ''
                } px-4 py-2 rounded-full transition-all ease-linear duration-200`}
              >
                <FontAwesomeIcon
                  icon={faCircle}
                  className={` text-white center ${
                    isDarkMode ? 'ml-2' : 'ml-[-0.5rem]'
                  } transition-all ease-linear duration-200`}
                />
              </button>
            </li>
            <li className='py-2 px-4 my-2 cursor-pointer hover:bg-hover-color dark:hover:bg-dark-hover-color'>
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
        <LazyLoadImage
          placeholderSrc={userImg}
          effect='blur'
          width={'2.25rem'}
          height={'2.25rem'}
          src={userData.avatar ? userData.avatar.url : userImg}
          alt={userData.firstName + ' ' + userData.lastName}
          className='w-9 h-9 ml-4 rounded-md object-cover cursor-pointer'
        />
      </button>
    </Tippy>
  )
}
