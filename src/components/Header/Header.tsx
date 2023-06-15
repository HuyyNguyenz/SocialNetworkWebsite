import { useEffect } from 'react'
import { faMessage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from '~/assets/images/logo.png'
import Search from '../Search'
import Navigation from '../Navigation'
import UserSetting from '../UserSetting'
import { Link } from 'react-router-dom'
import Notify from '../Notify'

export default function Header() {
  useEffect(() => {
    const headerElement = document.getElementById('header')
    const handleScroll = () => {
      window.scrollY > 200 ? headerElement?.classList.add('shadow-md') : headerElement?.classList.remove('shadow-md')
    }
    window.addEventListener('scroll', handleScroll)
  }, [])

  return (
    <header id='header' className='fixed top-0 left-0 w-full z-50'>
      <div className='flex items-center justify-between bg-white h-14 max-h-14 py-2 px-4 border border-solid border-border-color'>
        <Link to='/'>
          <img loading='lazy' src={logo} alt='logo' className='h-10 object-cover' />
        </Link>
        <Search />
        <div className='flex items-center justify-start text-text-color'>
          <FontAwesomeIcon icon={faMessage} className='w-5 h-5 px-4 mx-2 cursor-pointer' />
          <Notify />
          <UserSetting />
        </div>
      </div>
      <nav>
        <Navigation />
      </nav>
    </header>
  )
}
