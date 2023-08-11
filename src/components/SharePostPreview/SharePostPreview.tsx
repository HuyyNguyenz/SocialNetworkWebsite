import { useEffect, useState } from 'react'
import { Friend, Post, User } from '~/types'
import PostItem from '../PostItem'
import TextEditor from '../TextEditor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import fetchApi from '~/utils/fetchApi'
import userImg from '~/assets/images/user.png'
import { LazyLoadImage } from 'react-lazy-load-image-component'

interface Props {
  post: Post
  author: User
  type: string
  cancelled: (value: boolean) => void
}

export default function SharePostPreview(props: Props) {
  const { post, author, type } = props
  const userData = useSelector((state: RootState) => state.userData)
  const sharePost = useSelector((state: RootState) => state.postList.sharePost)
  const [friends, setFriends] = useState<Friend[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [userFriends, setUserFriends] = useState<User[]>([])
  const [usersSelected, setUsersSelected] = useState<number[]>([])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const user = Number(event.target.name.split('-')[1])
      setUsersSelected((prev) => [...prev, user])
    } else {
      const user = Number(event.target.name.split('-')[1])
      const index = usersSelected.findIndex((userSelected) => userSelected === user)
      usersSelected.splice(index, 1)
      setUsersSelected([...usersSelected])
    }
  }

  useEffect(() => {
    sharePost === null && props.cancelled(true)
  }, [sharePost, props])

  useEffect(() => {
    const controller = new AbortController()
    if (type === 'Chia sẻ qua tin nhắn') {
      fetchApi
        .get('friends', { signal: controller.signal })
        .then((res) => {
          const friendArray: Friend[] = []
          ;(res.data as Friend[]).forEach((friend: Friend) => {
            friend.friendId === userData.id && friend.status === 'accept' && friendArray.push(friend)
            friend.userId === userData.id && friend.status === 'accept' && friendArray.push(friend)
          })
          setFriends(friendArray)
        })
        .catch((error) => error.name !== 'CanceledError' && console.log(error))
      fetchApi
        .get('users', { signal: controller.signal })
        .then((res) => setUsers(res.data))
        .catch((error) => error.name !== 'CanceledError' && console.log(error))
    }
    return () => {
      controller.abort()
    }
  }, [type, userData])

  useEffect(() => {
    if (friends.length > 0 && users.length > 0) {
      const userFriends: User[] = []
      friends.forEach((friend) => {
        users.forEach((user) => {
          ;((friend.friendId === user.id && friend.friendId !== userData.id) ||
            (friend.userId === user.id && friend.userId !== userData.id)) &&
            userFriends.push(user)
        })
      })
      setUserFriends(userFriends)
    }
  }, [friends, users, userData])

  return (
    <>
      <div className='center px-4 md:px-10 fixed z-[60] w-full md:w-[48rem] h-[80%] animate-fade bg-input-color dark:bg-dark-input-color rounded-md border border-solid border-border-color dark:border-dark-border-color overflow-y-auto scrollbar'>
        <div className='flex items-center justify-between w-full py-4 text-title-color dark:text-dark-title-color text-18 font-semibold'>
          <h4>{type}</h4>
          <button
            onClick={() => props.cancelled(true)}
            className='w-10 py-2 rounded-full hover:bg-hover-color dark:hover:bg-dark-hover-color'
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <TextEditor
          usersShare={usersSelected}
          comment={false}
          share={`${import.meta.env.VITE_HOST_URL}${author.username}/post/${post.id}`}
        />
        {userFriends.length > 0 && (
          <div className='bg-bg-light dark:bg-bg-dark border border-solid border-border-color dark:border-dark-border-color rounded-md py-4 px-4 md:px-8 mb-8 max-h-56 overflow-y-auto scrollbar'>
            <h3 className='text-18 font-semibold text-title-color dark:text-dark-title-color'>Bạn bè</h3>
            {userFriends.map((user) => (
              <div key={user.id} className='py-3 flex items-center justify-between'>
                <div className='flex items-center justify-start'>
                  <LazyLoadImage
                    placeholderSrc={userImg}
                    effect='blur'
                    width={'2.25rem'}
                    height={'2.25rem'}
                    className='w-9 h-9 object-cover rounded-md'
                    src={user.avatar ? user.avatar.url : userImg}
                    alt={user.firstName + ' ' + user.lastName}
                  />
                  <span className='ml-2'>{user.firstName + ' ' + user.lastName}</span>
                </div>

                <input
                  onChange={handleChange}
                  type='checkbox'
                  name={`user-${user.id}`}
                  id='user'
                  className='cursor-pointer w-4 h-4'
                />
              </div>
            ))}
          </div>
        )}
        <PostItem post={post} author={author} detail={false} share={true} />
      </div>
      <div className='overlay'></div>
    </>
  )
}
