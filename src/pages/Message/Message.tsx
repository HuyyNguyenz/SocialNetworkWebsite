import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import TextEditor from '~/components/TextEditor'
import UserPreview from '~/components/UserPreview'
import DefaultLayout from '~/layouts/DefaultLayout'
import socket from '~/socket'
import { RootState } from '~/store'
import { Friend, Message, User } from '~/types'
import fetchApi from '~/utils/fetchApi'
import userImg from '~/assets/images/user.png'
import moment from 'moment'
import { setMessageList } from '~/features/message/messageSlice'
import SettingComment from '~/components/SettingComment'

export default function Messages() {
  const messageList = useSelector((state: RootState) => state.messageList.data)
  const userData = useSelector((state: RootState) => state.userData)
  const dispatch = useDispatch()
  const [userFriend, setUserFriend] = useState<User>()
  const [isReload, setReload] = useState<boolean>(false)
  const { userFriendId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()
    userFriendId &&
      fetchApi.get('friends', { signal: controller.signal }).then((res) => {
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
    return () => {
      controller.abort()
    }
  }, [userData.id, userFriendId, navigate])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi.get(`user/${userFriendId}`, { signal: controller.signal }).then((res) => setUserFriend(res.data))
    isReload && setReload(false)
    return () => {
      controller.abort()
    }
  }, [userFriendId, isReload])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi.get('messages', { signal: controller.signal }).then((res) => {
      const messageList: Message[] = []
      ;(res.data as Message[]).forEach((message) => {
        message.friendId === userData.id && message.userId === userFriend?.id && messageList.push(message)
        message.friendId === userFriend?.id && message.userId === userData.id && messageList.push(message)
      })
      dispatch(setMessageList(messageList))
    })
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
    fetchApi.put(`user/${userData.id}/p-${userFriendId}`, {}, { signal: controller.signal })
    return () => {
      controller.abort()
    }
  }, [userData.id, userFriendId])

  return (
    <DefaultLayout>
      <div className='pt-32 my-0 mx-auto w-[48rem] max-w-[48rem] text-14 text-text-color dark:text-dark-text-color bg-bg-light dark:bg-bg-dark border border-t-transparent border-b-transparent border-solid border-border-color dark:border-dark-border-color'>
        <div className='flex flex-col items-start justify-start'>
          <div className='mx-4'>{userFriend && <UserPreview data={userFriend} online={userFriend.isOnline} />}</div>
          <div
            id='container'
            className='scrollbar border border-l-transparent border-r-transparent border-solid border-border-color dark:border-dark-border-color bg-hover-color dark:bg-dark-hover-color w-full min-h-[24rem] max-h-96 overflow-y-auto'
          >
            {messageList.length > 0 &&
              userFriend &&
              messageList.map((message) => {
                const createdAt = moment(message.createdAt, 'DD/MM/YYYY hh:mm').fromNow()
                const modifiedAt = message.modifiedAt && moment(message.modifiedAt, 'DD/MM/YYYY hh:mm').fromNow()
                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.userId === userData.id ? 'flex-row-reverse' : ''
                    } items-start justify-start p-4`}
                  >
                    <img
                      className='w-8 h-8 object-cover rounded-md'
                      src={
                        message.userId === userData.id
                          ? userData.avatar
                            ? userData.avatar.url
                            : userImg
                          : userFriend.avatar
                          ? userFriend.avatar.url
                          : userImg
                      }
                      alt={
                        message.userId === userData.id
                          ? userData.firstName + ' ' + userData.lastName
                          : userFriend.firstName + ' ' + userFriend.lastName
                      }
                    />
                    <div
                      className={`flex flex-col ${
                        message.userId === userData.id ? 'items-end justify-end mr-2' : 'items-start justify-start ml-2'
                      } max-w-[60%]`}
                    >
                      {message.content !== '' && (
                        <p className='border border-solid border-border-color dark:border-dark-border-color rounded-md bg-input-color dark:bg-dark-input-color p-2'>
                          {message.deleted === 1 ? <del>Tin nhắn này đã bị gỡ</del> : message.content}
                        </p>
                      )}
                      {message.images && message.deleted === 0 && (
                        <div className='mt-4 w-[16rem] h-[16rem]'>
                          <img
                            loading='lazy'
                            className='rounded-md object-cover w-full h-full'
                            src={message.images[0].url}
                            alt={message.images[0].name}
                          />
                        </div>
                      )}
                      {message.video?.name && message.deleted === 0 && (
                        <div className='mt-4 w-full'>
                          <video className='rounded-md w-full h-full' src={message.video.url} controls>
                            <track src={message.video.url} kind='captions' srcLang='en' label='English' />
                          </video>
                        </div>
                      )}
                      <div className='flex flex-row-reverse items-start justify-start'>
                        <span className='text-xs mt-2'>
                          {message.modifiedAt ? `đã chỉnh sửa ${modifiedAt}` : createdAt}
                        </span>
                        {message.userId === userData.id && message.deleted === 0 && (
                          <SettingComment message={message} />
                        )}
                      </div>
                    </div>
                  </div>
                )
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
