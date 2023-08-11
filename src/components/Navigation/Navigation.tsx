import { faHome, faUserGroup, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'

export default function Navigation() {
  return (
    <div>
      <ul className='flex items-center justify-center text-title-color dark:text-dark-title-color text-24 bg-bg-light dark:bg-bg-dark border-b border-solid border-border-color dark:border-dark-border-color h-14 max-h-14'>
        <NavLink to='/'>
          <li className='relative w-24 text-center mx-4 lg:mx-8 cursor-pointer hover:text-primary-color dark:hover:text-dark-primary-color transition-all ease-linear duration-200'>
            <FontAwesomeIcon icon={faHome} />
            <div className='w-24 h-[0.125rem] bg-primary-color dark:bg-dark-primary-color absolute bottom-[-10px] left-0 hidden' />
          </li>
        </NavLink>
        <NavLink to='/friends'>
          <li className='relative w-24 text-center mx-4 lg:mx-8 cursor-pointer hover:text-primary-color dark:hover:text-dark-primary-color transition-all ease-linear duration-200'>
            <FontAwesomeIcon icon={faUserGroup} />
            <div className='w-24 h-[0.125rem] bg-primary-color dark:bg-dark-primary-color absolute bottom-[-10px] left-0 hidden' />
          </li>
        </NavLink>
        <NavLink to='/communities'>
          <li className='relative w-24 text-center mx-4 lg:mx-8 cursor-pointer hover:text-primary-color dark:hover:text-dark-primary-color transition-all ease-linear duration-200'>
            <FontAwesomeIcon icon={faUsers} />
            <div className='w-24 h-[0.125rem] bg-primary-color dark:bg-dark-primary-color absolute bottom-[-10px] left-0 hidden' />
          </li>
        </NavLink>
      </ul>
    </div>
  )
}
