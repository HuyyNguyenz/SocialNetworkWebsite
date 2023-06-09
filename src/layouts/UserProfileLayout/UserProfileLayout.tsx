import { NavLink, useParams } from 'react-router-dom'
import DefaultLayout from '~/layouts/DefaultLayout'
import userImg from '~/assets/images/user.png'
import { useState, useEffect } from 'react'
import backgroundDefault from '~/assets/images/background_default.jpg'
import { User } from '~/types'
import fetchApi from '~/utils/fetchApi'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import EditProfile from '~/components/EditProfile'
import Skeleton from 'react-loading-skeleton'
import Loading from '~/components/Loading'

interface Props {
  children: React.ReactNode
}

export default function UserProfileLayout(props: Props) {
  const { children } = props
  const { userId } = useParams()
  const userData = useSelector((state: RootState) => state.userData)
  const [user, setUser] = useState<User>()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isOpenEditProfile, setOpenEditProfile] = useState<boolean>(false)

  useEffect(() => {
    if (userId) {
      setLoading(true)
      const controller = new AbortController()
      fetchApi.get(`user/${userId}`, { signal: controller.signal }).then((res) => {
        setUser(res.data)
      })
      window.scrollTo(0, 0)
      const loading = setTimeout(() => {
        setLoading(false)
      }, 1000)
      return () => {
        controller.abort()
        clearTimeout(loading)
      }
    }
  }, [userId])

  useEffect(() => {
    setUser(userData)
  }, [userData])

  return (
    <DefaultLayout>
      <main>
        <div className='w-[48rem] max-w-3xl my-0 mx-auto pb-10'>
          <div className='flex flex-col items-start justify-start bg-white border-b border-solid border-border-color'>
            {isLoading ? (
              <Skeleton className='w-full h-[25rem] rounded-md object-cover' />
            ) : (
              <img
                loading='lazy'
                className='w-full h-[25rem] rounded-md object-cover'
                src={user?.backgroundImage ? user.backgroundImage.url : backgroundDefault}
                alt={user?.firstName + ' ' + user?.lastName}
              />
            )}
            <div className='mt-4 flex items-center justify-between w-full'>
              <div className='flex items-center justify-start flex-1'>
                {isLoading ? (
                  <Skeleton className='w-28 h-28 rounded-md object-cover' />
                ) : (
                  <img
                    loading='lazy'
                    src={user?.avatar ? user.avatar.url : userImg}
                    alt={user?.firstName + ' ' + user?.lastName}
                    className='w-28 h-28 rounded-md object-cover'
                  />
                )}
                <div className='flex flex-col items-start justify-start font-bold ml-4 flex-1'>
                  <h1 className='text-24 text-title-color line-clamp-1'>{user?.firstName + ' ' + user?.lastName}</h1>
                  <span className='text-14 text-text-color opacity-60'>69 bạn bè</span>
                </div>
              </div>
              {userData.username === user?.username ? (
                <button
                  onClick={() => {
                    setOpenEditProfile(true)
                    document.body.classList.add('overflow-y-hidden')
                  }}
                  className='bg-gradient-to-r from-primary-color to-secondary-color text-white font-semibold text-14 rounded-md p-2 hover:opacity-90'
                >
                  Chỉnh sửa trang cá nhân
                </button>
              ) : (
                <div className='flex items-center justify-start text-14 font-semibold'>
                  <button className='border border-solid border-border-color rounded-md bg-input-color py-2 px-4 hover:bg-hover-color'>
                    Kết bạn
                  </button>
                  <button className='border border-solid border-border-color rounded-md bg-primary-color text-white py-2 px-4 ml-4 hover:opacity-90'>
                    Nhắn tin
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className='mt-10 flex items-start justify-start'>
            <div className='bg-white rounded-md border border-solid border-border-color font-semibold text-14 text-title-color'>
              <ul>
                <NavLink to={`/profile/${userId}/posts`}>
                  <li className='px-10 py-2 my-2 hover:text-primary-color transition-all ease-linear duration-200 cursor-pointer'>
                    Bài viết
                  </li>
                </NavLink>
                <li className='px-10 py-2 my-2 hover:text-primary-color transition-all ease-linear duration-200 cursor-pointer'>
                  Bạn bè
                </li>
                <li className='px-10 py-2 my-2 hover:text-primary-color transition-all ease-linear duration-200 cursor-pointer'>
                  Ảnh
                </li>
                <li className='px-10 py-2 my-2 hover:text-primary-color transition-all ease-linear duration-200 cursor-pointer'>
                  Video
                </li>
              </ul>
            </div>

            <div className='flex-1 ml-4 max-w-[38.75rem] overflow-hidden'>
              {isLoading ? <Loading quantity={1} /> : children}
            </div>
          </div>
        </div>
      </main>
      {isOpenEditProfile && <EditProfile isOpen={(isOpen) => setOpenEditProfile(isOpen)} />}
    </DefaultLayout>
  )
}
