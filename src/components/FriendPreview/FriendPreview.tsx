import { useEffect, useState } from 'react'
import { Friend, User } from '~/types'
import userImg from '~/assets/images/user.png'
import { Link } from 'react-router-dom'
import fetchApi from '~/utils/fetchApi'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import socket from '~/socket'

interface Props {
  data: User
  type: string
  reload: (value: boolean) => void
}

export default function FriendPreview(props: Props) {
  const userData = useSelector((state: RootState) => state.userData)
  const [friends, setFriends] = useState<Friend[]>([])
  const [isPending, setPending] = useState<boolean>(false)
  const { data, type } = props

  const handleMakeFriend = async () => {
    await fetchApi.post('friend', { status: 'pending', friendId: data.id, userId: userData.id })
    socket.emit('sendRequestClient', { status: 'pending', friendId: data.id, userId: userData.id })
    setPending(true)
  }

  const handleAcceptFriend = async () => {
    const foundFriend = friends.find((friend) => friend.friendId === userData.id && friend.userId === data.id)
    await fetchApi.put(`friend/${foundFriend?.id}`, {})
    socket.emit('sendRequestClient', { id: foundFriend?.id })
    props.reload(true)
  }

  const handleClick = () => {
    switch (type) {
      case 'suggest':
        handleMakeFriend()
        break
      case 'invite':
        handleAcceptFriend()
        break
      default:
        break
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    ;(type === 'suggest' || type === 'invite') &&
      fetchApi
        .get('friends', { signal: controller.signal })
        .then((res) => {
          type === 'invite' && setFriends(res.data)
          ;(res.data as Friend[]).find(
            (friend) => friend.friendId === data.id && friend.userId === userData.id && setPending(true)
          )
        })
        .catch((error) => error.name !== 'CanceledError' && console.log(error))

    return () => {
      controller.abort()
    }
  }, [type, data.id, userData.id])

  return (
    data && (
      <div className='w-40 max-w-[10rem] pb-4 flex flex-col items-start justify-start bg-input-color dark:bg-dark-input-color text-14 text-center font-semibold border border-solid border-border-color dark:border-dark-border-color rounded-md overflow-hidden'>
        <Link to={`/${data.username}/profile/${data.id}/posts`}>
          <img
            className='w-full h-40 object-cover'
            loading='lazy'
            src={data.avatar ? data.avatar.url : userImg}
            alt={data.firstName + ' ' + data.lastName}
          />
          <h5 className='my-2 dark:text-dark-text-color'>{data.firstName + ' ' + data.lastName}</h5>
        </Link>
        {isPending ? (
          <button className='w-28 py-1 text-primary-color dark:text-dark-primary-color bg-bg-light dark:bg-bg-dark border border-solid border-border-color dark:border-dark-border-color my-0 mx-auto rounded-md hover:bg-hover-color dark:hover:bg-dark-hover-color'>
            <Link to={`/${data.username}/profile/${data.id}/posts`}>Đã gửi lời mời</Link>
          </button>
        ) : (
          <button
            onClick={handleClick}
            className='w-28 py-1 text-white bg-primary-color dark:bg-dark-primary-color my-0 mx-auto rounded-md hover:opacity-90'
          >
            {type === 'invite' ? (
              'Xác nhận'
            ) : type === 'friend' ? (
              <Link to={`/message/${data.id}`}>
                <span className='w-full inline-block'>Nhắn tin</span>
              </Link>
            ) : (
              'Kết bạn'
            )}
          </button>
        )}
      </div>
    )
  )
}
