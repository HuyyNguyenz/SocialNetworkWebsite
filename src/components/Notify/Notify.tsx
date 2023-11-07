import { faBell, faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react/headless'
import { useEffect, useState, useCallback, Fragment } from 'react'
import { Comment, ExtraPost, Friend, Notify as NotifyType, User } from '~/types'
import fetchApi from '~/utils/fetchApi'
import UserPreview from '../UserPreview'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import socket from '~/utils/socket'
import audioMessage from '~/assets/audios/audio_message.mp3'

export default function Notify() {
  const userData = useSelector((state: RootState) => state.userData.data)
  const [isOpen, setOpen] = useState<boolean>(false)
  const [friends, setFriends] = useState<Friend[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [likes, setLikes] = useState<ExtraPost[]>([])
  const [friendNotifies, setFriendNotifies] = useState<NotifyType[]>([])
  const [postNotifies, setPostNotifies] = useState<NotifyType[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isShowInviteNotify, setShowInviteNotify] = useState<boolean>(true)
  const [isReload, setReload] = useState<boolean>(false)

  const handleFindUser = (userId: number) => {
    return users.find((user) => user.id === userId)
  }

  const handleFindFriend = (friendId: number) => {
    return friends.find((friend) => Number(friend.id) === friendId)
  }

  const handleFindComment = (commentId: number) => {
    return comments.find((comment) => Number(comment.id) === commentId)
  }

  const handleFindLikePost = (id: number) => {
    return likes.find((like) => like.id === id)
  }

  const handleCheckSeenNotify = (notifies: NotifyType[]) => {
    let isUnSeen = false
    notifies.find((notify) => {
      const friend = handleFindFriend(Number(notify.typeId)) as Friend
      if (notify.status === 'unseen' && notify.type === 'friend') {
        if (friend.userId === userData.id && friend.status === 'pending') {
          isUnSeen = false
        } else {
          isUnSeen = true
        }
      } else if (notify.status === 'unseen' && (notify.type === 'comment' || notify.type === 'likedPost')) {
        isUnSeen = true
      }
    })
    return isUnSeen
  }

  const handleSeenNotify = async (notifyId: number, type: string) => {
    ;(await fetchApi.put(`notify/${notifyId}`, { receiverId: userData.id })).data
    const notifyPostIndex = postNotifies.findIndex((notify) => Number(notify.id) === notifyId)
    const notifyFriendIndex = friendNotifies.findIndex((notify) => Number(notify.id) === notifyId)
    switch (type) {
      case 'comment':
        postNotifies[notifyPostIndex].status = 'seen'
        setPostNotifies([...postNotifies])
        break
      case 'likedPost':
        postNotifies[notifyPostIndex].status = 'seen'
        setPostNotifies([...postNotifies])
        break
      case 'friend':
        friendNotifies[notifyFriendIndex].status = 'seen'
        setFriendNotifies([...friendNotifies])
        break
      default:
        break
    }
  }

  const handleGetNotifies = useCallback(
    (controller: AbortController) => {
      fetchApi
        .get('notifies', { signal: controller.signal })
        .then((res) => {
          const notifyFriendList: NotifyType[] = []
          const notifyPostList: NotifyType[] = []
          ;(res.data as NotifyType[]).forEach((notify) => {
            friends.length > 0 &&
              friends.forEach((friend) => {
                ;(notify.type === 'friend' &&
                  notify.typeId === friend.id &&
                  userData.id === notify.receiverId &&
                  friend.status === 'pending' &&
                  notifyFriendList.push(notify)) ||
                  (notify.type === 'friend' &&
                    notify.typeId === friend.id &&
                    userData.id === notify.receiverId &&
                    friend.status === 'accept' &&
                    notifyFriendList.push(notify))
              })
            ;(notify.type === 'comment' || notify.type === 'likedPost') &&
              notify.receiverId === userData.id &&
              notifyPostList.push(notify)
          })
          notifyFriendList.sort((a, b) => Number(b.id) - Number(a.id))
          notifyPostList.sort((a, b) => Number(b.id) - Number(a.id))
          setFriendNotifies(notifyFriendList)
          setPostNotifies(notifyPostList)
        })
        .catch((error) => error.name !== 'CanceledError' && console.log(error))
    },
    [friends, userData.id]
  )

  useEffect(() => {
    const controller = new AbortController()
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
    const controller = new AbortController()
    fetchApi
      .get('friends', { signal: controller.signal })
      .then((res) => {
        setFriends(res.data)
      })
      .catch((error) => error.name !== 'CanceledError' && console.log(error))
    isReload && setReload(false)
    return () => {
      controller.abort()
    }
  }, [isReload])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi
      .get('comments', { signal: controller.signal })
      .then((res) => {
        setComments(res.data)
      })
      .catch((error) => error.name !== 'CanceledError' && console.log(error))
    isReload && setReload(false)
    return () => {
      controller.abort()
    }
  }, [isReload])

  useEffect(() => {
    const controller = new AbortController()
    handleGetNotifies(controller)
    isReload && setReload(false)
    return () => {
      controller.abort()
    }
  }, [handleGetNotifies, isReload])

  useEffect(() => {
    const controller = new AbortController()
    const socketId = socket.id

    fetchApi
      .put(`user/${userData.id}/true`, {}, { signal: controller.signal })
      .catch((error) => error.name !== 'CanceledError' && console.log(error))
    fetchApi
      .put(`user/${userData.id}`, { socketId }, { signal: controller.signal })
      .catch((error) => error.name !== 'CanceledError' && console.log(error))
    socket.emit('sendRequestOnlineClient', { userId: userData.id })

    socket.on('sendCommentNotify', () => {
      !isReload && setReload(true)
    })

    socket.on('sendInviteFriendNotify', () => {
      !isReload && setReload(true)
    })

    socket.on('sendAcceptFriendNotify', () => {
      !isReload && setReload(true)
    })

    socket.on('receiveUserLikedPost', () => {
      !isReload && setReload(true)
    })

    return () => {
      controller.abort()
    }
  }, [userData.id, isReload])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi
      .get('likes', { signal: controller.signal })
      .then((res) => setLikes(res.data))
      .catch((error) => error.name !== 'CanceledError' && console.log(error))
    isReload && setReload(false)
    return () => {
      controller.abort()
    }
  }, [isReload])

  useEffect(() => {
    const playNotificationSound = () => {
      const notificationSound = new Audio(audioMessage)
      notificationSound.play()
    }
    isReload && playNotificationSound()
  }, [isReload])

  return (
    <div>
      <Tippy
        onClickOutside={() => setOpen(false)}
        placement='bottom-start'
        interactive
        visible={isOpen}
        render={(attrs) => (
          <div
            className='scrollbar bg-bg-light dark:bg-bg-dark border border-solid border-border-color dark:border-dark-border-color shadow-lg w-[22.5rem] max-h-[31.25rem] overflow-y-auto rounded-md animate-fade text-text-color dark:text-dark-text-color text-14 p-2'
            tabIndex={-1}
            {...attrs}
          >
            <h2 className='text-20 font-bold text-title-color dark:text-dark-title-color mx-2'>Thông báo</h2>
            {friendNotifies.length > 0 || postNotifies.length > 0 ? (
              ''
            ) : (
              <span className='mx-2'>Bạn chưa có thông báo</span>
            )}
            <div className='flex items-center justify-start my-2 font-semibold text-16 text-title-color dark:text-dark-title-color'>
              {friendNotifies.length > 0 && (
                <button
                  onClick={() => setShowInviteNotify(true)}
                  className={`py-1 px-2 rounded-full ${
                    isShowInviteNotify
                      ? 'bg-hover-color dark:bg-dark-hover-color text-primary-color dark:text-dark-primary-color border border-solid border-border-color dark:border-dark-border-color'
                      : ''
                  } hover:bg-hover-color dark:hover:bg-dark-hover-color mr-6`}
                >
                  <span>Lời mời kết bạn</span>
                  {handleCheckSeenNotify(friendNotifies) && (
                    <FontAwesomeIcon
                      className='ml-2 text-primary-color dark:text-dark-primary-color text-14'
                      icon={faCircle}
                    />
                  )}
                </button>
              )}
              {postNotifies.length > 0 && (
                <button
                  onClick={() => setShowInviteNotify(false)}
                  className={`py-1 px-2 rounded-full ${
                    isShowInviteNotify
                      ? ''
                      : 'bg-hover-color dark:bg-dark-hover-color text-primary-color dark:text-dark-primary-color border border-solid border-border-color dark:border-dark-border-color'
                  } hover:bg-hover-color dark:hover:bg-dark-hover-color`}
                >
                  <span>Bài viết</span>
                  {handleCheckSeenNotify(postNotifies) && (
                    <FontAwesomeIcon
                      className='ml-2 text-primary-color dark:text-dark-primary-color text-14'
                      icon={faCircle}
                    />
                  )}
                </button>
              )}
            </div>
            {isShowInviteNotify ? (
              <div>
                {friendNotifies.length > 0 &&
                  friendNotifies.map((notify) => {
                    const friend = handleFindFriend(notify.typeId as number) as Friend
                    const user = handleFindUser(
                      userData.id === friend.friendId ? (friend.userId as number) : (friend.friendId as number)
                    ) as User

                    return (
                      <Fragment key={notify.id}>
                        {friend.userId === userData.id && friend.status === 'pending' ? (
                          ''
                        ) : (
                          <button
                            onClick={() => {
                              notify.status === 'unseen'
                                ? handleSeenNotify(Number(notify.id), notify.type as string)
                                : null
                              setOpen(false)
                            }}
                            className={`${
                              notify.status === 'unseen'
                                ? 'flex items-center justify-between bg-hover-color dark:bg-dark-hover-color'
                                : ''
                            } cursor-pointer hover:bg-hover-color dark:hover:bg-dark-hover-color rounded-md mb-4 py-2 w-full`}
                          >
                            <UserPreview data={user} friend={friend} />
                            <FontAwesomeIcon
                              icon={faCircle}
                              className={`${
                                notify.status === 'unseen'
                                  ? 'inline-block text-primary-color dark:text-dark-primary-color mr-2'
                                  : 'hidden'
                              }`}
                            />
                          </button>
                        )}
                      </Fragment>
                    )
                  })}
              </div>
            ) : (
              <div>
                {postNotifies.length > 0 &&
                  postNotifies.map((notify) => {
                    const data =
                      notify.type === 'comment'
                        ? handleFindComment(notify.typeId as number)
                        : handleFindLikePost(notify.typeId as number)
                    const user = handleFindUser(Number(data?.userId)) as User

                    return (
                      <button
                        key={notify.id}
                        onClick={() => {
                          notify.status === 'unseen' ? handleSeenNotify(Number(notify.id), notify.type as string) : null
                          setOpen(false)
                        }}
                        className={`${
                          notify.status === 'unseen'
                            ? 'flex items-center justify-between bg-hover-color dark:bg-dark-hover-color'
                            : ''
                        } cursor-pointer hover:bg-hover-color dark:hover:bg-dark-hover-color rounded-md mb-4 py-2 w-full`}
                      >
                        {notify.type === 'comment' ? (
                          <UserPreview data={user} comment={data as Comment} />
                        ) : (
                          <UserPreview data={user} liked={data as ExtraPost} />
                        )}
                        <FontAwesomeIcon
                          icon={faCircle}
                          className={`${
                            notify.status === 'unseen'
                              ? 'inline-block text-primary-color dark:text-dark-primary-color mr-2'
                              : 'hidden'
                          }`}
                        />
                      </button>
                    )
                  })}
              </div>
            )}
          </div>
        )}
      >
        <button className='relative' onClick={() => setOpen(!isOpen)}>
          <FontAwesomeIcon
            icon={faBell}
            className={`w-5 h-5 px-4 mx-2 cursor-pointer ${
              isOpen ? 'text-primary-color dark:text-dark-primary-color' : 'text-title-color dark:text-dark-title-color'
            }`}
          />
          {((friendNotifies.length > 0 && handleCheckSeenNotify(friendNotifies)) ||
            (postNotifies.length > 0 && handleCheckSeenNotify(postNotifies))) && (
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
