import { useEffect } from 'react'
import { faCrown, faReply, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import userImg from '~/assets/images/user.png'
import { Comment, User } from '~/types'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import SettingComment from '../SettingComment'
import { Link } from 'react-router-dom'

interface Props {
  comment: Comment
  author: User
  authorPostId: number
}

export default function Comment(props: Props) {
  const { comment, author, authorPostId } = props
  const userData = useSelector((state: RootState) => state.userData)
  const createdAt = moment(comment.createdAt, 'DD/MM/YYYY hh:mm').fromNow()
  const modifiedAt = moment(comment.modifiedAt, 'DD/MM/YYYY hh:mm').fromNow()

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, [])

  return (
    <div className={`my-4 ${comment.deleted === 1 && 'opacity-60'}`}>
      <div className='flex items-start justify-start'>
        <Link to={`/${author.username}/profile/${author.id}/posts`}>
          <img
            loading='lazy'
            src={author.avatar ? author.avatar.url : userImg}
            alt={author.firstName + ' ' + author.lastName}
            className='w-8 h-8 object-cover rounded-md'
          />
        </Link>
        <div className='ml-4'>
          <div className='flex flex-col items-start justify-start bg-input-color dark:bg-dark-input-color rounded-md border border-solid border-border-color dark:border-dark-border-color py-2 px-4'>
            <div className='mb-1 flex items-center justify-start'>
              <Link to={`/${author.username}/profile/${author.id}/posts`}>
                <span className='text-primary-color dark:text-dark-primary-color font-bold'>
                  {author.firstName} {author.lastName}
                </span>
              </Link>
              {author.id === authorPostId && <FontAwesomeIcon icon={faCrown} className='ml-2 text-crown-color' />}
              <span className='ml-2 text-xs'>{createdAt}</span>
              {comment.modifiedAt && <span className='ml-2 opacity-60 text-xs'>| Đã chỉnh sửa {modifiedAt}</span>}
            </div>
            {comment.deleted === 0 ? (
              <p className='break-all'>{comment.content}</p>
            ) : (
              <del className='dark:text-dark-text-color'>Bình luận này đã bị xoá</del>
            )}
          </div>
          {comment.images && comment.deleted === 0 && (
            <div className='mt-4 w-[16rem] h-[16rem]'>
              <img
                loading='lazy'
                className='rounded-md object-cover w-full h-full'
                src={comment.images[0].url}
                alt={comment.images[0].name}
              />
            </div>
          )}
          {comment.video?.name && comment.deleted === 0 && (
            <div className='mt-4 w-[26rem]'>
              <video className='rounded-md w-full h-full' src={comment.video.url} controls>
                <track src={comment.video.url} kind='captions' srcLang='en' label='English' />
              </video>
            </div>
          )}
          {comment.deleted === 0 && (
            <div className='flex items-center justify-start py-2 px-4 text-16'>
              <button className='flex items-center justify-start mr-8'>
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  className='hover:bg-hover-color dark:hover:bg-dark-hover-color rounded-full p-2'
                />
                <span className='ml-2 text-14'>0</span>
              </button>
              <button className='flex items-center justify-start mr-8'>
                <FontAwesomeIcon
                  icon={faReply}
                  className='hover:bg-hover-color dark:hover:bg-dark-hover-color rounded-full p-2'
                />
                <span className='ml-2 text-14'>0</span>
              </button>
              {userData.id === comment.userId && <SettingComment comment={comment} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
