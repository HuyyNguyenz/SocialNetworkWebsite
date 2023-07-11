import { faCircle, faMessage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react/headless'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { Friend, Message, Notify, User } from '~/types'
import fetchApi from '~/utils/fetchApi'
import UserPreview from '../UserPreview'
import socket from '~/socket'
import audioMessage from '~/assets/audios/audio_message.mp3'

export default function MessageNotify() {
  const userData = useSelector((state: RootState) => state.userData)
  const [isOpen, setOpen] = useState<boolean>(false)
  const [messageNotifies, setMessageNotifies] = useState<Notify[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isReload, setReload] = useState<boolean>(false)

  const handleFindLatestMessage = (userId: number) => {
    const messageArray: Message[] = []
    messages.forEach((message) => message.userId === userId && messageArray.push(message))
    return messageArray.pop()
  }

  const handleFindNotify = (messageId: number) => {
    return messageNotifies.find((messageNotify) => messageNotify.typeId === messageId)
  }

  const handleCheckUnseenNotify = () => {
    let isUnseen = false
    users.forEach((user) => {
      const message = handleFindLatestMessage(user.id as number)
      const notify = handleFindNotify(message?.id as number)
      notify?.status === 'unseen' && (isUnseen = true)
    })
    return isUnseen
  }

  const handleSeenNotify = async (notify: Notify) => {
    notify.status === 'unseen' && (await fetchApi.put(`notify/${notify.id}`, { receiverId: userData.id })).data
    notify.status === 'unseen' && setReload(true)
    setOpen(false)
  }

  const playNotificationSound = () => {
    const notificationSound = new Audio(audioMessage)
    notificationSound.play()
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchApi.get('notifies', { signal: controller.signal }).then((res) => {
      const notifies: Notify[] = []
      ;(res.data as Notify[]).filter(
        (notify) => notify.type === 'message' && notify.receiverId === userData.id && notifies.push(notify)
      )
      setMessageNotifies(notifies)
      isReload && setReload(false)
    })
    return () => {
      controller.abort()
    }
  }, [userData.id, isReload])

  useEffect(() => {
    const controller = new AbortController()
    messageNotifies.length > 0 &&
      fetchApi.get('messages', { signal: controller.signal }).then((res) => {
        const messageArray: Message[] = []
        ;(res.data as Message[]).filter((message) => {
          messageNotifies.forEach((messageNotify) => {
            messageNotify.typeId === message.id && messageArray.push(message)
          })
        })
        setMessages(messageArray)
      })
    return () => {
      controller.abort()
    }
  }, [messageNotifies])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi.get('friends', { signal: controller.signal }).then((res) => {
      const friendArray: Friend[] = []
      ;(res.data as Friend[]).filter((friend) => {
        friend.friendId === userData.id && friend.status === 'accept' && friendArray.push(friend)
        friend.userId === userData.id && friend.status === 'accept' && friendArray.push(friend)
      })
      setFriends(friendArray)
      isReload && setReload(false)
    })
    return () => {
      controller.abort()
    }
  }, [userData.id, isReload])

  useEffect(() => {
    const controller = new AbortController()
    friends.length > 0 &&
      fetchApi.get('users', { signal: controller.signal }).then((res) => {
        const userArray: User[] = []
        ;(res.data as User[]).filter((user) => {
          friends.forEach((friend) => {
            friend.friendId === user.id && friend.friendId !== userData.id && userArray.push(user)
            friend.userId === user.id && friend.userId !== userData.id && userArray.push(user)
          })
        })
        setUsers(userArray)
      })
    return () => {
      controller.abort()
    }
  }, [friends, userData.id])

  useEffect(() => {
    socket.on('sendMessageNotify', (data) => {
      data.userId === userData.id && setReload(true)
      data.userId === userData.id && playNotificationSound()
    })
  }, [userData.id])

  return (
    <div>
      <Tippy
        onClickOutside={() => setOpen(false)}
        placement='bottom-start'
        interactive
        visible={isOpen}
        render={(attrs) => (
          <div
            className='bg-bg-light dark:bg-bg-dark border border-solid border-border-color dark:border-dark-border-color shadow-lg w-[22.5rem] max-h-[31.25rem] overflow-y-auto rounded-md animate-fade text-text-color dark:text-dark-text-color text-14 p-2'
            tabIndex={-1}
            {...attrs}
          >
            <h2 className='text-20 font-bold text-title-color dark:text-dark-title-color mx-2 mb-2'>Tin nhắn</h2>

            {users.length > 0 ? (
              users.map((user) => {
                const message = handleFindLatestMessage(user.id as number)
                const notify = handleFindNotify(message?.id as number)
                return message ? (
                  <button
                    onClick={() => handleSeenNotify(notify as Notify)}
                    key={user.id}
                    className={`${
                      notify?.status === 'unseen'
                        ? 'flex items-center justify-between bg-hover-color dark:bg-dark-hover-color font-semibold'
                        : ''
                    } cursor-pointer hover:bg-hover-color dark:hover:bg-dark-hover-color rounded-md mb-4 py-2 w-full`}
                  >
                    <UserPreview data={user} message={message} />
                    <FontAwesomeIcon
                      icon={faCircle}
                      className={`${
                        notify?.status === 'unseen'
                          ? 'inline-block text-primary-color dark:text-dark-primary-color mr-2'
                          : 'hidden'
                      }`}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => setOpen(false)}
                    key={user.id}
                    className='cursor-pointer hover:bg-hover-color dark:hover:bg-dark-hover-color rounded-md mb-4 py-2 w-full'
                  >
                    <UserPreview data={user} noMessage={true} />
                  </button>
                )
              })
            ) : (
              <span className='mx-2'>Bạn chưa có tin nhắn</span>
            )}
          </div>
        )}
      >
        <button className='relative' onClick={() => setOpen(!isOpen)}>
          <FontAwesomeIcon icon={faMessage} className='w-5 h-5 px-4 mx-2 cursor-pointer dark:text-dark-title-color' />
          {handleCheckUnseenNotify() && (
            <FontAwesomeIcon
              className='absolute top-[-2px] right-5 text-primary-color dark:text-dark-primary-color text-14'
              icon={faCircle}
            />
          )}
        </button>
      </Tippy>
    </div>
  )
}
