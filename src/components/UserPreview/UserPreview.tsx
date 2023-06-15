import moment from 'moment'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import userImg from '~/assets/images/user.png'
import { RootState } from '~/store'
import { Comment, Friend, User } from '~/types'

interface Props {
  data: User
  friend?: Friend
  comment?: Comment
}

export default function UserPreview(props: Props) {
  const { data, friend, comment } = props
  const userData = useSelector((state: RootState) => state.userData)
  const createdAt = moment(comment?.createdAt, 'DD/MM/YYYY hh:mm').fromNow()

  return (
    <>
      {data && (
        <Link to={comment ? `/${userData.username}/post/${comment.postId}` : `/profile/${data.username}/posts`}>
          <div
            className={`flex items-center justify-start text-14 rounded-md cursor-pointer ${
              friend?.id || comment?.id ? 'ml-2' : 'mb-4 hover:bg-input-color'
            }`}
          >
            <img
              loading='lazy'
              src={data.avatar ? data.avatar.url : userImg}
              alt={data.firstName + ' ' + data.lastName}
              className='w-8 h-8 object-cover rounded-md mr-2'
            />
            <div className='flex flex-col items-start justify-start text-left'>
              <span className={`${friend?.id || comment?.id ? 'font-semibold' : ''}`}>
                {data.firstName} {data.lastName}
              </span>{' '}
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
              {comment && <span>đã bình luận vào bài viết của bạn lúc {createdAt}</span>}
            </div>
          </div>
        </Link>
      )}
    </>
  )
}
