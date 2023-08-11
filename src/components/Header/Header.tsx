import { useEffect } from 'react'
import logo from '~/assets/images/logo.png'
import Search from '../Search'
import Navigation from '../Navigation'
import UserSetting from '../UserSetting'
import { Link } from 'react-router-dom'
import Notify from '../Notify'
import MessageNotify from '../MessageNotify'

export default function Header() {
  const controller = document.querySelector('.controller')
  const logoElement = document.querySelector('.logo')

  const handleHidden = (value: boolean) => {
    if (window.innerWidth < 768 && value) {
      logoElement?.classList.add('hidden')
      controller?.classList.add('hidden')
    } else {
      logoElement?.classList.remove('hidden')
      controller?.classList.remove('hidden')
    }
  }

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
        <div className='flex items-center justify-start'>
          <div className='logo'>
            <Link to='/'>
              <img src={logo} alt='logo' className='h-10 object-cover' />
            </Link>
          </div>
          <Search hidden={(value) => handleHidden(value)} />
        </div>
        <div className='controller flex items-center justify-start text-text-color pr-4'>
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
