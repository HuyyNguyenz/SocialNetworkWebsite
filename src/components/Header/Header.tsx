import { faMessage, faBell, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from '~/assets/images/logo.png'
import Search from '../Search'
import Navigation from '../Navigation'
import UserSetting from '../UserSetting'

export default function Header() {
  return (
    <header className='fixed top-0 left-0 w-full'>
      <div className='flex items-center justify-between bg-white h-14 max-h-14 py-2 px-4 border border-solid border-border-color'>
        <img src={logo} alt='logo' className='h-full object-cover' />
        <Search />
        <div className='flex items-center justify-start text-text-color'>
          <FontAwesomeIcon icon={faMessage} className='w-5 h-5 px-4 mx-2 cursor-pointer' />
          <FontAwesomeIcon icon={faBell} className='w-5 h-5 px-4 mx-2 cursor-pointer' />
          <UserSetting />
        </div>
      </div>
      <nav>
        <Navigation />
      </nav>
    </header>
  )
}
