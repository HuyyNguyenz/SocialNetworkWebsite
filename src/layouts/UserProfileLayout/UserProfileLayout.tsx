import { Link, NavLink, useParams } from 'react-router-dom'
import DefaultLayout from '~/layouts/DefaultLayout'
import userImg from '~/assets/images/user.png'
import { useState, useEffect, useCallback } from 'react'
import backgroundDefault from '~/assets/images/background_default.jpg'
import { Friend, User } from '~/types'
import fetchApi from '~/utils/fetchApi'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import EditProfile from '~/components/EditProfile'
import Skeleton from 'react-loading-skeleton'
import Loading from '~/components/Loading'
import socket from '~/socket'

interface Props {
  children: React.ReactNode
}

export default function UserProfileLayout(props: Props) {
  const { children } = props
  const { username, userId } = useParams()
  const userData = useSelector((state: RootState) => state.userData.data)
  const [user, setUser] = useState<User>()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isOpenEditProfile, setOpenEditProfile] = useState<boolean>(false)
  const [friend, setFriend] = useState<Friend>()
  const [friends, setFriends] = useState<Friend[]>([])

  const handleMakeFriend = async () => {
    await fetchApi.post('friend', { status: 'pending', friendId: user?.id, userId: userData.id })
    await handleCheckStatus()
    socket.emit('sendRequestClient', { status: 'pending', friendId: user?.id, userId: userData.id })
  }

  const handleDeleteFriend = async () => {
    const friends: Friend[] = (await fetchApi.get('friends')).data
    const friendDetail = friends.find(
      (friend) =>
        (friend.friendId === user?.id && friend.userId === userData.id) ||
        (friend.friendId === userData.id && friend.userId === user?.id)
    )
    await fetchApi.delete(`friend/${friendDetail?.id}`)
    setFriend({})
    socket.emit('sendRequestRemoveClient', {
      userId: userData.id === friendDetail?.friendId ? friendDetail?.userId : friendDetail?.friendId
    })
  }

  const handleAcceptFriend = async () => {
    await fetchApi.put(`friend/${friend?.id}`, {})
    await handleCheckStatus()
    socket.emit('sendRequestClient', { id: friend?.id })
  }

  const handleFilterFriend = useCallback(
    (friendList: Friend[]) => {
      const friendArray: Friend[] = []
      friendList.filter(
        (friend) =>
          (friend.friendId === Number(userId) && friend.status === 'accept' && friendArray.push(friend)) ||
          (friend.userId === Number(userId) && friend.status === 'accept' && friendArray.push(friend))
      )
      setFriends(friendArray)
    },
    [userId]
  )

  const handleCheckStatus = useCallback(async () => {
    const result: Friend[] = (await fetchApi.get('friends')).data
    handleFilterFriend(result)
    result.find(
      (friend) =>
        (friend.friendId === user?.id && friend.userId === userData.id && setFriend(friend)) ||
        (friend.friendId === userData.id && friend.userId === user?.id && setFriend(friend))
    )
  }, [user?.id, userData.id, handleFilterFriend])

  useEffect(() => {
    handleCheckStatus()
  }, [handleCheckStatus])

  useEffect(() => {
    if (userId) {
      setFriend({})
      setLoading(true)
      const controller = new AbortController()
      fetchApi
        .get(`user/${userId}`, { signal: controller.signal })
        .then((res) => {
          setUser(res.data)
        })
        .catch((error) => error.name !== 'CanceledError' && console.log(error))
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

  useEffect(() => {
    socket.on('sendInviteFriendNotify', (res) => {
      res.message !== '' && res.userId === userData.id && handleCheckStatus()
    })

    socket.on('sendAcceptFriendNotify', (res) => {
      res.message !== '' && res.userId === userData.id && handleCheckStatus()
    })

    socket.on('sendRemoveInviteFriendNotify', (res) => {
      res.userId === userData.id && setFriend({})
    })
  }, [handleCheckStatus, userData.id])

  return (
    <DefaultLayout>
      <main>
        <div className='md:w-[48rem] md:max-w-3xl my-0 mx-auto pb-10'>
          <div className='flex flex-col items-start justify-start bg-bg-light dark:bg-bg-dark border-b border-solid border-border-color dark:border-dark-border-color'>
            {isLoading ? (
              <Skeleton className='w-80 md:w-[48rem] h-[20rem] md:h-[25rem] md:rounded-md object-cover dark:bg-bg-dark' />
            ) : (
              <img
                className='w-full h-[20rem] md:h-[25rem] md:rounded-md object-cover'
                src={user?.backgroundImage ? user.backgroundImage.url : backgroundDefault}
                alt={user?.firstName + ' ' + user?.lastName}
              />
            )}
            <div className='mt-4 flex flex-col md:flex-row items-center justify-between w-full'>
              <div className='flex flex-col md:flex-row items-center justify-start flex-1'>
                {isLoading ? (
                  <Skeleton className='w-28 h-28 rounded-md object-cover dark:bg-bg-dark' />
                ) : (
                  <img
                    src={user?.avatar ? user.avatar.url : userImg}
                    alt={user?.firstName + ' ' + user?.lastName}
                    className='w-28 h-28 rounded-md object-cover'
                  />
                )}
                <div className='flex flex-col items-center md:items-start justify-start font-bold ml-4 flex-1'>
                  {isLoading ? (
                    <Skeleton className='w-52 h-6 dark:bg-bg-dark' />
                  ) : (
                    <h1 className='text-24 text-title-color dark:text-dark-title-color line-clamp-1 mt-2 md:my-0'>
                      {user?.firstName + ' ' + user?.lastName}
                    </h1>
                  )}
                  {isLoading ? (
                    <Skeleton className='w-20 h-5 dark:bg-bg-dark' />
                  ) : (
                    <span className='text-14 text-text-color dark:text-dark-text-color opacity-60'>
                      {friends.length} bạn bè
                    </span>
                  )}
                </div>
              </div>
              {userData.username === user?.username ? (
                <button
                  onClick={() => {
                    setOpenEditProfile(true)
                    document.body.classList.add('overflow-y-hidden')
                  }}
                  className='bg-gradient-to-r from-primary-color dark:from-dark-primary-color to-secondary-color dark:to-secondary-color text-white font-semibold text-14 rounded-md p-2 hover:opacity-90 my-4 md:my-0'
                >
                  Chỉnh sửa trang cá nhân
                </button>
              ) : (
                <div className='flex items-center justify-start text-14 font-semibold my-4 md:my-0'>
                  {friend && friend.friendId !== userData.id && friend.status === 'pending' ? (
                    <>
                      <button
                        onClick={handleDeleteFriend}
                        className='dark:text-dark-text-color border border-solid border-border-color dark:border-dark-border-color rounded-md bg-input-color dark:bg-dark-input-color py-2 px-4 hover:bg-hover-color dark:hover:bg-dark-hover-color'
                      >
                        Huỷ lời mời kết bạn
                      </button>
                      <span className='dark:text-dark-text-color opacity-50 ml-4'>Đang theo dõi</span>
                    </>
                  ) : friend && friend.userId !== userData.id && friend.status === 'pending' ? (
                    <>
                      <button
                        onClick={handleAcceptFriend}
                        className='border border-solid border-border-color dark:border-dark-border-color rounded-md bg-primary-color dark:bg-dark-primary-color text-white py-2 px-4 hover:opacity-90'
                      >
                        Phản hồi
                      </button>
                      <button
                        onClick={handleDeleteFriend}
                        className='dark:text-dark-text-color ml-4 border border-solid border-border-color dark:border-dark-border-color rounded-md bg-input-color dark:bg-dark-input-color py-2 px-4 hover:bg-hover-color dark:hover:bg-dark-hover-color'
                      >
                        Từ chối
                      </button>
                    </>
                  ) : friend && friend.status === 'accept' ? (
                    <>
                      <button
                        onClick={handleDeleteFriend}
                        className='border border-solid border-border-color dark:border-dark-border-color rounded-md bg-input-color dark:bg-dark-input-color py-2 px-4 hover:bg-hover-color dark:hover:bg-dark-hover-color dark:text-dark-text-color'
                      >
                        Huỷ kết bạn
                      </button>
                      <Link to={`/message/${user?.id}`}>
                        <button className='border border-solid border-border-color dark:border-dark-border-color rounded-md bg-primary-color dark:bg-dark-primary-color text-white py-2 px-4 ml-4 hover:opacity-90'>
                          Nhắn tin
                        </button>
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={handleMakeFriend}
                      className='dark:text-dark-text-color border border-solid border-border-color dark:border-dark-border-color rounded-md bg-input-color dark:bg-dark-input-color py-2 px-4 hover:bg-hover-color dark:hover:bg-dark-hover-color'
                    >
                      Kết bạn
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className='md:mt-10 flex flex-col md:flex-row items-start justify-start'>
            <div className='w-full p-4 md:p-0 md:w-auto bg-bg-light dark:bg-bg-dark md:rounded-md border border-solid border-border-color dark:border-dark-border-color font-semibold text-14 text-title-color dark:text-dark-title-color'>
              <ul className='flex items-center justify-between md:flex-col'>
                <NavLink to={`/${username}/profile/${userId}/posts`}>
                  <li className='md:px-10 md:py-2 md:my-2 hover:text-primary-color dark:hover:text-dark-primary-color transition-all ease-linear duration-200 cursor-pointer'>
                    Bài viết
                  </li>
                </NavLink>
                <NavLink to={`/${username}/profile/${userId}/friends`}>
                  <li className='md:px-10 md:py-2 md:my-2 hover:text-primary-color dark:hover:text-dark-primary-color transition-all ease-linear duration-200 cursor-pointer'>
                    Bạn bè
                  </li>
                </NavLink>
                <li className='md:px-10 md:py-2 md:my-2 hover:text-primary-color dark:hover:text-dark-primary-color transition-all ease-linear duration-200 cursor-pointer'>
                  Ảnh
                </li>
                <li className='md:px-10 md:py-2 md:my-2 hover:text-primary-color dark:hover:text-dark-primary-color transition-all ease-linear duration-200 cursor-pointer'>
                  Video
                </li>
              </ul>
            </div>

            <div className='flex-1 mt-8 w-full md:mt-0 md:ml-4 md:max-w-[38.75rem] overflow-hidden'>
              {isLoading ? <Loading quantity={1} /> : children}
            </div>
          </div>
        </div>
      </main>
      {isOpenEditProfile && <EditProfile isOpen={(isOpen) => setOpenEditProfile(isOpen)} />}
    </DefaultLayout>
  )
}
