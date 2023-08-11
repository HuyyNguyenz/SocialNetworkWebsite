import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import FriendPreview from '~/components/FriendPreview'
import UserProfileLayout from '~/layouts/UserProfileLayout'
import { RootState } from '~/store'
import { Friend, User } from '~/types'
import fetchApi from '~/utils/fetchApi'

export default function UserFriend() {
  const userData = useSelector((state: RootState) => state.userData.data)
  const { userId } = useParams()
  const [users, setUsers] = useState<User[]>([])
  const [friendsOther, setFriendsOther] = useState<Friend[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [userFriends, setUserFriends] = useState<User[]>([])
  const [isReload, setReload] = useState<boolean>(false)

  const handleCheckStatusFriend = (id: number) => {
    let status = false
    friendsOther.find(
      (friend) =>
        (friend.friendId === id && friend.userId === userData.id && friend.status === 'accept' && (status = true)) ||
        (friend.userId === id && friend.friendId === userData.id && friend.status === 'accept' && (status = true))
    )
    return status
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchApi
      .get('users', { signal: controller.signal })
      .then((res) => setUsers(res.data))
      .catch((error) => error.name !== 'CanceledError' && console.log(error))
    fetchApi
      .get('friends', { signal: controller.signal })
      .then((res) => {
        const friendArray: Friend[] = []
        ;(res.data as Friend[]).forEach((friend: Friend) => {
          Number(userId) === friend.userId && friend.status === 'accept' && friendArray.push(friend)
          Number(userId) === friend.friendId && friend.status === 'accept' && friendArray.push(friend)
        })
        setFriendsOther(res.data)
        setFriends(friendArray)
      })
      .catch((error) => error.name !== 'CanceledError' && console.log(error))
    isReload && setReload(false)
    return () => {
      controller.abort()
    }
  }, [userId, isReload])

  useEffect(() => {
    if (users.length > 0 && friends.length > 0) {
      const userFriendArray: User[] = []
      friends.forEach((friend) => {
        users.forEach((user) => {
          friend.friendId === user.id && friend.friendId !== Number(userId) && userFriendArray.push(user)
          friend.userId === user.id && friend.userId !== Number(userId) && userFriendArray.push(user)
        })
      })
      setUserFriends(userFriendArray)
    }
    isReload && setReload(false)
  }, [users, friends, userId, isReload])

  return (
    <UserProfileLayout>
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 bg-hover-color dark:bg-dark-hover-color p-4 rounded-md border border-solid border-border-color dark:border-dark-border-color'>
        {userFriends.length > 0 &&
          userFriends.map((userFriend) => (
            <FriendPreview
              key={userFriend.id}
              data={userFriend}
              type={
                userFriend.id === userData.id
                  ? ''
                  : handleCheckStatusFriend(userFriend.id as number)
                  ? 'friend'
                  : 'suggest'
              }
              reload={(value) => setReload(value)}
            />
          ))}
      </div>
    </UserProfileLayout>
  )
}
