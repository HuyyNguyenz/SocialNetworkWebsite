import moment from 'moment'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import userImg from '~/assets/images/user.png'
import { RootState } from '~/store'
import { Comment, ExtraPost, Friend, Message, User } from '~/types'

interface Props {
  data: User
  friend?: Friend
  comment?: Comment
  liked?: ExtraPost
  message?: Message
  online?: string
  noMessage?: boolean
}

export default function UserPreview(props: Props) {
  const { data, friend, comment, message, online, noMessage, liked } = props
  const userData = useSelector((state: RootState) => state.userData.data)

  return (
    <>
      {data && (
        <Link
          to={
            comment || liked
              ? `/${userData.username}/post/${comment?.postId || liked?.postId}`
              : message || noMessage
              ? `/message/${data.id}`
              : `/${data.username}/profile/${data.id}/posts`
          }
        >
          <div
            className={`flex items-center justify-start text-14 rounded-md cursor-pointer ${
              friend?.id || comment?.id || liked?.id || message?.id || noMessage
                ? 'ml-2'
                : 'mb-4 hover:bg-input-color dark:hover:bg-dark-hover-color'
            } ${online ? 'hover:bg-transparent dark:hover:bg-transparent' : ''} `}
          >
            <LazyLoadImage
              placeholderSrc={userImg}
              effect='blur'
              width={'2.25rem'}
              height={'2.25rem'}
              src={data.avatar ? data.avatar.url : userImg}
              alt={data.firstName + ' ' + data.lastName}
              className='w-9 h-9 object-cover rounded-md'
            />
            <div className='flex flex-col items-start justify-start text-left dark:text-dark-text-color ml-2'>
              <span
                className={`${
                  friend?.id || comment?.id || liked?.id || online || message?.id || noMessage ? 'font-semibold ' : ''
                }`}
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
                <>
                  <span>đã bình luận vào bài viết của bạn</span>
                  <span>{moment(comment?.createdAt, 'DD/MM/YYYY hh:mm').fromNow()}</span>
                </>
              )}
              {liked && <span>đã thích bài viết của bạn</span>}
              {message ? (
                message.content ? (
                  <div className='flex flex-col items-start justify-start'>
                    <span className='line-clamp-1 break-all'>
                      {message.deleted === 1 ? 'Tin nhắn này đã bị gỡ' : message.content}
                    </span>
                    <span className='font-normal'>{moment(message?.createdAt, 'DD/MM/YYYY hh:mm').fromNow()}</span>
                  </div>
                ) : message?.video?.name ? (
                  <div className='flex flex-col items-start justify-start'>
                    <span>đã gửi 1 video</span>
                    <span>{moment(message?.createdAt, 'DD/MM/YYYY hh:mm').fromNow()}</span>
                  </div>
                ) : (
                  <div className='flex flex-col items-start justify-start'>
                    <span>đã gửi 1 ảnh</span>
                    <span>{moment(message?.createdAt, 'DD/MM/YYYY hh:mm').fromNow()}</span>
                  </div>
                )
              ) : (
                ''
              )}

              {noMessage ? <span>Người dùng này chưa có tin nhắn</span> : ''}

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
