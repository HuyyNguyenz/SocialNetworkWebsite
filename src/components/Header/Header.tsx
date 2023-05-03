import { faMessage, faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from '~/assets/images/logo.png'
import userImg from '~/assets/images/user.png'

export default function Header() {
  return (
    <header>
      <div className='flex items-center justify-between bg-white h-14 max-h-14 py-2 px-4'>
        <img src={logo} alt='logo' className='h-full object-cover' />
        <div>
          <input type='text' name='search' id='search' placeholder='Tìm kiếm bạn bè...' className='w-full h-full' />
        </div>
        <div className='flex items-center justify-start'>
          <FontAwesomeIcon icon={faMessage} className='w-5 h-5' />
          <FontAwesomeIcon icon={faBell} className='w-5 h-5' />
          <img src={userImg} alt='userImg' className='w-8 h-8 rounded-full' />
        </div>
      </div>
    </header>
  )
}
