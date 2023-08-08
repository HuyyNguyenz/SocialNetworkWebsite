import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import DefaultLayout from '~/layouts/DefaultLayout'
import { RootState } from '~/store'

interface Props {
  children: React.ReactNode
}

export default function UserSettingLayout(props: Props) {
  const { children } = props
  const userData = useSelector((state: RootState) => state.userData)
  const { username, userId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    userData.username !== username && userData.id !== userId && navigate('/')
  }, [userData, navigate, username, userId])

  return (
    <DefaultLayout>
      <div className='pt-32 pb-10 my-0 mx-auto w-[48rem] max-w-[48rem] text-14 flex flex-col items-start justify-start'>
        <h1 className='text-18 text-title-color dark:text-dark-title-color font-bold'>Cài đặt chung</h1>
        <div className='flex items-start justify-start mt-4 w-full'>
          <div className='bg-bg-light dark:bg-bg-dark rounded-md border border-solid border-border-color dark:border-dark-border-color font-semibold text-title-color dark:text-dark-title-color'>
            <ul>
              <NavLink to={`/${userData.username}/setting/${userData.id}`}>
                <li className='px-4 py-2 my-2 hover:text-primary-color dark:hover:text-dark-primary-color transition-all ease-linear duration-200 cursor-pointer'>
                  <span>Thông tin tài khoản</span>
                </li>
              </NavLink>
              <li className='px-4 py-2 my-2 hover:text-primary-color dark:hover:text-dark-primary-color transition-all ease-linear duration-200 cursor-pointer'>
                <span>Thay đổi mật khẩu</span>
              </li>
            </ul>
          </div>
          {children}
        </div>
      </div>
    </DefaultLayout>
  )
}
