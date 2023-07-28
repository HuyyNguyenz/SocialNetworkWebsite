import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import TextEditor from '~/components/TextEditor'
import UserPreview from '~/components/UserPreview'
import DefaultLayout from '~/layouts/DefaultLayout'
import socket from '~/socket'
import { RootState } from '~/store'
import { Friend, Message as MessageType, User } from '~/types'
import fetchApi from '~/utils/fetchApi'
import { setMessageList } from '~/features/message/messageSlice'
import Message from '~/components/Message'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo } from '@fortawesome/free-solid-svg-icons'

export default function Chat() {
  const messageList = useSelector((state: RootState) => state.messageList.data)
  const userData = useSelector((state: RootState) => state.userData)
  const dispatch = useDispatch()
  const [userFriend, setUserFriend] = useState<User>()
  const [isReload, setReload] = useState<boolean>(false)
  const { userFriendId } = useParams()
  const navigate = useNavigate()

  const handleCallVideo = () => {
    const from = userData
    const to = userFriend
    socket.emit('startingCallUser', { from, to })
    socket.emit('pendingCall', { from, to })
  }

  useEffect(() => {
    const controller = new AbortController()
    userFriendId &&
      fetchApi
        .get('friends', { signal: controller.signal })
        .then((res) => {
          let isFriend = false
          ;(res.data as Friend[]).forEach((friend) => {
            friend.friendId === userData.id &&
              friend.userId === Number(userFriendId) &&
              friend.status === 'accept' &&
              (isFriend = true)
            friend.friendId === Number(userFriendId) &&
              friend.userId === userData.id &&
              friend.status === 'accept' &&
              (isFriend = true)
          })
          !isFriend && navigate('/')
        })
        .catch((error) => error.name !== 'CanceledError' && console.log(error))
    return () => {
      controller.abort()
    }
  }, [userData.id, userFriendId, navigate])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi
      .get(`user/${userFriendId}`, { signal: controller.signal })
      .then((res) => setUserFriend(res.data))
      .catch((error) => error.name !== 'CanceledError' && console.log(error))
    isReload && setReload(false)
    return () => {
      controller.abort()
    }
  }, [userFriendId, isReload])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi
      .get('messages', { signal: controller.signal })
      .then((res) => {
        const messageList: MessageType[] = []
        ;(res.data as MessageType[]).forEach((message) => {
          message.friendId === userData.id && message.userId === userFriend?.id && messageList.push(message)
          message.friendId === userFriend?.id && message.userId === userData.id && messageList.push(message)
        })
        dispatch(setMessageList(messageList))
      })
      .catch((error) => error.name !== 'CanceledError' && console.log(error))
    return () => {
      controller.abort()
    }
  }, [isReload, dispatch, userData.id, userFriend?.id])

  useEffect(() => {
    socket.on('sendStatusActive', () => {
      setReload(true)
    })
    socket.on('sendMessageNotify', (data) => {
      data.userId === userData.id && setReload(true)
    })
  }, [userData.id])

  useEffect(() => {
    const container = document.getElementById('container') as HTMLDivElement
    messageList && container && (container.scrollTop = container.scrollHeight)
  }, [messageList])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi
      .put(`user/${userData.id}/p-${userFriendId}`, {}, { signal: controller.signal })
      .catch((error) => error.name !== 'CanceledError' && console.log(error))
    return () => {
      controller.abort()
    }
  }, [userData.id, userFriendId])

  return (
    <DefaultLayout>
      <div className='relative pt-32 my-0 mx-auto w-[48rem] max-w-[48rem] text-14 text-text-color dark:text-dark-text-color bg-bg-light dark:bg-bg-dark border border-t-transparent border-b-transparent border-solid border-border-color dark:border-dark-border-color'>
        <div className='flex flex-col items-start justify-start'>
          <div className='px-4 flex items-center justify-between w-full'>
            {userFriend && <UserPreview data={userFriend} online={userFriend.isOnline} />}{' '}
            {userFriend?.isOnline !== 'false' && (
              <button
                onClick={handleCallVideo}
                className='text-title-color dark:text-dark-title-color hover:text-primary-color dark:hover:text-dark-primary-color'
              >
                <FontAwesomeIcon className='text-16' icon={faVideo} />
              </button>
            )}
          </div>
          <div
            id='container'
            className='scrollbar border border-l-transparent border-r-transparent border-solid border-border-color dark:border-dark-border-color bg-hover-color dark:bg-dark-hover-color w-full min-h-[24rem] max-h-96 overflow-y-auto'
          >
            {messageList.length > 0 &&
              userFriend &&
              messageList.map((message) => {
                return <Message key={message.id} message={message} userFriend={userFriend} />
              })}
          </div>
          <div className='w-full p-4'>
            <TextEditor comment={true} chatUserId={userFriend?.id} />
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
