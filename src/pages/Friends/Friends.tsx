import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import FriendPreview from '~/components/FriendPreview'
import DefaultLayout from '~/layouts/DefaultLayout'
import socket from '~/socket'
import { RootState } from '~/store'
import { Friend, User } from '~/types'
import fetchApi from '~/utils/fetchApi'

export default function Friends() {
  const userData = useSelector((state: RootState) => state.userData)
  const [statusFriends, setStatusFriends] = useState<Friend[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [inviteFriends, setInviteFriends] = useState<User[]>([])
  const [friends, setFriends] = useState<User[]>([])
  const [isReload, setReload] = useState<boolean>(false)

  const handleFindUser = useCallback(
    (userId: number) => {
      return users.find((user) => user.id === userId)
    },
    [users]
  )

  const handleCheckStatusFriend = (friendId: number) => {
    let checked = false
    inviteFriends.length > 0 && inviteFriends.find((friend) => friend.id === friendId && (checked = true))
    friends.length > 0 && friends.find((friend) => friend.id === friendId && (checked = true))
    return checked
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchApi
      .get('friends', { signal: controller.signal })
      .then((res) => {
        setStatusFriends(res.data)
      })
      .catch((error) => error.name !== 'CanceledError' && console.log(error))
    fetchApi
      .get('users', { signal: controller.signal })
      .then((res) => {
        setUsers(res.data)
      })
      .catch((error) => error.name !== 'CanceledError' && console.log(error))
    isReload && setReload(false)
    return () => {
      controller.abort()
    }
  }, [isReload])

  useEffect(() => {
    const inviteFriendList: User[] = []
    users.length > 0 &&
      statusFriends.forEach((friend) => {
        const user = handleFindUser(friend.userId as number) as User
        friend.friendId === userData.id && friend.status === 'pending' && inviteFriendList.push(user)
      })
    setInviteFriends(inviteFriendList)
  }, [handleFindUser, userData.id, users.length, statusFriends])

  useEffect(() => {
    const friendList: User[] = []
    users.length > 0 &&
      statusFriends.forEach((friend) => {
        const user = handleFindUser(
          friend.friendId === userData.id ? (friend.userId as number) : (friend.friendId as number)
        ) as User
        friend.status === 'accept' &&
          (friend.friendId === userData.id || friend.userId === userData.id) &&
          friendList.push(user)
      })
    setFriends(friendList)
  }, [handleFindUser, userData.id, users.length, statusFriends])

  useEffect(() => {
    socket.on('sendInviteFriendNotify', (res: any) => {
      res.message !== '' && res.userId === userData.id && setReload(true)
    })
    socket.on('sendAcceptFriendNotify', (res: any) => {
      res.message !== '' && res.userId === userData.id && setReload(true)
    })
  }, [userData.id])

  return (
    <DefaultLayout>
      <div className='pt-32 pb-10 my-0 mx-auto w-[48rem] max-w-[48rem] text-14'>
        {inviteFriends.length > 0 && (
          <div className='text-center mb-4'>
            <h3 className='dark:text-dark-title-color font-bold text-18 mb-4 text-left'>Lời mời kết bạn</h3>
            <div className='bg-bg-light dark:bg-bg-dark p-4 border border-solid border-border-color dark:border-dark-border-color rounded-md'>
              <div className='grid grid-cols-4 gap-4'>
                {inviteFriends.map((user) => (
                  <FriendPreview key={user.id} data={user} type='invite' reload={(value) => setReload(value)} />
                ))}
              </div>
              {/* <button className='text-primary-color font-bold hover:text-secondary-color transition-all ease-linear duration-200 mt-8'>
                <span className='mr-2'>Xem thêm</span>
                <FontAwesomeIcon icon={faAngleDown} />
              </button> */}
            </div>
          </div>
        )}
        {friends.length > 0 && (
          <div className='text-center mb-4'>
            <h3 className='font-bold text-18 mb-4 text-left dark:text-dark-title-color'>Bạn bè</h3>
            <div className='bg-bg-light dark:bg-bg-dark p-4 border border-solid border-border-color dark:border-dark-border-color rounded-md'>
              <div className='grid grid-cols-4 gap-4'>
                {friends.map((user) => (
                  <FriendPreview key={user.id} data={user} type='friend' reload={(value) => setReload(value)} />
                ))}
              </div>
              {/* <button className='text-primary-color font-bold hover:text-secondary-color transition-all ease-linear duration-200 mt-8'>
                <span className='mr-2'>Xem thêm</span>
                <FontAwesomeIcon icon={faAngleDown} />
              </button> */}
            </div>
          </div>
        )}
        <div className='text-center mb-4'>
          <h3 className='font-bold text-18 mb-4 text-left dark:text-dark-title-color'>Gợi ý kết bạn</h3>
          <div className='bg-bg-light dark:bg-bg-dark p-4 border border-solid border-border-color dark:border-dark-border-color rounded-md'>
            <div className='grid grid-cols-4 gap-4'>
              {users.length > 0 &&
                users.map(
                  (user) =>
                    !handleCheckStatusFriend(user.id as number) &&
                    user.id !== userData.id && (
                      <FriendPreview key={user.id} data={user} type='suggest' reload={(value) => setReload(value)} />
                    )
                )}
            </div>
            {/* <button className='text-primary-color font-bold hover:text-secondary-color transition-all ease-linear duration-200 mt-8'>
              <span className='mr-2'>Xem thêm</span>
              <FontAwesomeIcon icon={faAngleDown} />
            </button> */}
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
