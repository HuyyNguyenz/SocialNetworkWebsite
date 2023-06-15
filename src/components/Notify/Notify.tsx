import { faBell, faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react/headless'
import { useEffect, useState, useCallback, Fragment } from 'react'
import { Comment, Friend, Notify as NotifyType, User } from '~/types'
import fetchApi from '~/utils/fetchApi'
import UserPreview from '../UserPreview'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

export default function Notify() {
  const userData = useSelector((state: RootState) => state.userData)
  const [isOpen, setOpen] = useState<boolean>(false)
  const [friends, setFriends] = useState<Friend[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [friendNotifies, setFriendNotifies] = useState<NotifyType[]>([])
  const [commentNotifies, setCommentNotifies] = useState<NotifyType[]>([])
  const [users, setUsers] = useState<User[]>([])

  const handleFindUser = (userId: number) => {
    return users.find((user) => user.id === userId)
  }

  const handleFindFriend = (friendId: number) => {
    return friends.find((friend) => Number(friend.id) === friendId)
  }

  const handleFindComment = (commentId: number) => {
    return comments.find((comment) => Number(comment.id) === commentId)
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
      } else if (notify.status === 'unseen' && notify.type === 'comment') {
        isUnSeen = true
      } else {
        isUnSeen = false
      }
    })
    return isUnSeen
  }

  const handleSeenNotify = async (notifyId: number) => {
    ;(await fetchApi.put(`notify/${notifyId}`, { receiverId: userData.id })).data
  }

  const handleGetNotifies = useCallback(
    (controller: AbortController) => {
      fetchApi.get('notifies', { signal: controller.signal }).then((res) => {
        const notifyFriendList: NotifyType[] = []
        const notifyCommentList: NotifyType[] = []
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
          notify.type === 'comment' && notify.receiverId === userData.id && notifyCommentList.push(notify)
        })
        notifyFriendList.sort((a, b) => Number(b.id) - Number(a.id))
        notifyCommentList.sort((a, b) => Number(b.id) - Number(a.id))
        setFriendNotifies(notifyFriendList)
        setCommentNotifies(notifyCommentList)
      })
    },
    [friends, userData.id]
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchApi.get('users', { signal: controller.signal }).then((res) => {
      setUsers(res.data)
    })
    return () => {
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi.get('friends', { signal: controller.signal }).then((res) => {
      setFriends(res.data)
    })
    return () => {
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi.get('comments', { signal: controller.signal }).then((res) => {
      setComments(res.data)
    })
    return () => {
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    handleGetNotifies(controller)
    return () => {
      controller.abort()
    }
  }, [handleGetNotifies])

  return (
    <div>
      <Tippy
        onClickOutside={() => setOpen(false)}
        placement='bottom-start'
        interactive
        visible={isOpen}
        render={(attrs) => (
          <div
            className='bg-white border border-solid border-border-color shadow-lg w-[22.5rem] max-h-[31.25rem] overflow-y-scroll rounded-md animate-fade text-text-color text-14 p-2'
            tabIndex={-1}
            {...attrs}
          >
            <h2 className='text-20 font-bold text-title-color mx-2'>Thông báo</h2>
            <div className='mt-4'>
              <div className='flex items-center justify-between mb-2 mx-2'>
                <h3 className='text-title-color text-16 font-semibold'>Lời mời kết bạn</h3>
                <button className='text-primary-color hover:font-semibold'>Xem tất cả</button>
              </div>
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
                          onClick={() => handleSeenNotify(Number(notify.id))}
                          className={`${
                            notify.status === 'unseen' ? 'flex items-center justify-between bg-hover-color' : ''
                          } cursor-pointer hover:bg-hover-color rounded-md mb-4 py-2 w-full`}
                        >
                          <UserPreview data={user} friend={friend} />
                          <FontAwesomeIcon
                            icon={faCircle}
                            className={`${
                              notify.status === 'unseen' ? 'inline-block text-primary-color mr-2' : 'hidden'
                            }`}
                          />
                        </button>
                      )}
                    </Fragment>
                  )
                })}
            </div>
            <div className='mt-4'>
              <div className='flex items-center justify-between mb-2 mx-2'>
                <h3 className='text-title-color text-16 font-semibold'>Bình luận bài viết</h3>
              </div>
              {commentNotifies.length > 0 &&
                commentNotifies.map((notify) => {
                  const comment = handleFindComment(notify.typeId as number) as Comment
                  const user = handleFindUser(Number(comment?.userId)) as User
                  return (
                    <button
                      key={notify.id}
                      onClick={() => handleSeenNotify(Number(notify.id))}
                      className={`${
                        notify.status === 'unseen' ? 'flex items-center justify-between bg-hover-color' : ''
                      } cursor-pointer hover:bg-hover-color rounded-md mb-4 py-2 w-full`}
                    >
                      <UserPreview data={user} comment={comment} />
                      <FontAwesomeIcon
                        icon={faCircle}
                        className={`${notify.status === 'unseen' ? 'inline-block text-primary-color mr-2' : 'hidden'}`}
                      />
                    </button>
                  )
                })}
            </div>
          </div>
        )}
      >
        <button className='relative' onClick={() => setOpen(!isOpen)}>
          <FontAwesomeIcon icon={faBell} className='w-5 h-5 px-4 mx-2 cursor-pointer' />
          {((friendNotifies.length > 0 && handleCheckSeenNotify(friendNotifies)) ||
            (commentNotifies.length > 0 && handleCheckSeenNotify(commentNotifies))) && (
            <FontAwesomeIcon className='absolute top-[-2px] right-5 text-primary-color text-14' icon={faCircle} />
          )}
        </button>
      </Tippy>
    </div>
  )
}
