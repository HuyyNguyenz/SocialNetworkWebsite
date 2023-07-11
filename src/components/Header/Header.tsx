import { useEffect } from 'react'
import logo from '~/assets/images/logo.png'
import Search from '../Search'
import Navigation from '../Navigation'
import UserSetting from '../UserSetting'
import { Link } from 'react-router-dom'
import Notify from '../Notify'
import MessageNotify from '../MessageNotify'

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
      <div className='flex items-center justify-between bg-bg-light dark:bg-bg-dark h-14 max-h-14 py-2 px-4 border border-l-transparent border-r-transparent border-solid border-border-color dark:border-dark-border-color dark:border-l-transparent dark:border-r-transparent'>
        <Link to='/'>
          <img loading='lazy' src={logo} alt='logo' className='h-10 object-cover' />
        </Link>
        <Search />
        <div className='flex items-center justify-start text-text-color'>
          <MessageNotify />
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
