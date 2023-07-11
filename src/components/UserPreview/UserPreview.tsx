import moment from 'moment'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import userImg from '~/assets/images/user.png'
import { RootState } from '~/store'
import { Comment, Friend, Message, User } from '~/types'

interface Props {
  data: User
  friend?: Friend
  comment?: Comment
  message?: Message
  online?: string
  noMessage?: boolean
}

export default function UserPreview(props: Props) {
  const { data, friend, comment, message, online, noMessage } = props
  const userData = useSelector((state: RootState) => state.userData)

  return (
    <>
      {data && (
        <Link
          to={
            comment
              ? `/${userData.username}/post/${comment.postId}`
              : message || noMessage
              ? `/message/${data.id}`
              : `/${data.username}/profile/${data.id}/posts`
          }
        >
          <div
            className={`flex items-center justify-start text-14 rounded-md cursor-pointer ${
              friend?.id || comment?.id || message?.id || noMessage
                ? 'ml-2'
                : 'mb-4 hover:bg-input-color dark:hover:bg-dark-hover-color'
            } ${online ? 'hover:bg-transparent dark:hover:bg-transparent' : ''} `}
          >
            <img
              loading='lazy'
              src={data.avatar ? data.avatar.url : userImg}
              alt={data.firstName + ' ' + data.lastName}
              className='w-9 h-9 object-cover rounded-md mr-2'
            />
            <div className='flex flex-col items-start justify-start text-left dark:text-dark-text-color'>
              <span
                className={`${friend?.id || comment?.id || online || message?.id || noMessage ? 'font-semibold ' : ''}`}
              >
                {data.firstName} {data.lastName}
              </span>
              {friend && (
                <span>
                  {/* Người nhận đang trạng thái pending */}
                  {friend.friendId === userData.id && friend.status === 'pending' && 'đã gửi cho bạn lời mời kết bạn'}
                  {/* Người nhận đang trạng thái accept */}
                  {friend.friendId === userData.id && friend.status === 'accept' && 'và bạn đã là bạn bè'}
                  {/* Người gửi đang trạng thái accept */}
                  {friend.userId === userData.id && friend.status === 'accept' && 'đã chấp nhận lời mời kết bạn'}
                </span>
              )}
              {comment && (
                <span>
                  đã bình luận vào bài viết của bạn lúc {moment(comment?.createdAt, 'DD/MM/YYYY hh:mm').fromNow()}
                </span>
              )}
              {message ? (
                message.content ? (
                  <div className='flex flex-col items-start justify-start'>
                    <span className='line-clamp-1 mr-2 flex-1'>{message.content}.</span>
                    <span className='font-normal'>{moment(message?.createdAt, 'DD/MM/YYYY hh:mm').fromNow()}</span>
                  </div>
                ) : message?.video?.name ? (
                  <span>đã gửi 1 video. {moment(message?.createdAt, 'DD/MM/YYYY hh:mm').fromNow()}</span>
                ) : (
                  <span>đã gửi 1 ảnh. {moment(message?.createdAt, 'DD/MM/YYYY hh:mm').fromNow()}</span>
                )
              ) : (
                ''
              )}

              {noMessage ? <span>Bạn chưa có tin nhắn với người này</span> : ''}

              {online === 'false' ? (
                <span>Đã rời mạng</span>
              ) : online === 'true' || online?.includes('p-') ? (
                <div className='flex items-center justify-start text-14'>
                  <span>Đang hoạt động</span>
                  <div className='relative flex h-3 w-3 ml-2'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-color dark:bg-dark-primary-color opacity-75'></span>
                    <span className='relative inline-flex rounded-full h-3 w-3 bg-primary-color dark:bg-dark-primary-color'></span>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </Link>
      )}
    </>
  )
}
