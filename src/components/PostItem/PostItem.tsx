import { useState, useEffect } from 'react'
import { Comment, FilePreview, Post, User } from '~/types'
import moment from 'moment'
import userImg from '~/assets/images/user.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots, faEarthAmericas, faLock, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import SettingPost from '../SettingPost'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import fetchApi from '~/utils/fetchApi'
import { setCommentList } from '~/features/comment/commentSlice'
import socket from '~/socket'
import { RootState } from '~/store'

interface Props {
  post: Post
  author: User
  detail: boolean
}

export default function PostItem(props: Props) {
  const { post, author, detail } = props
  const commentList = useSelector((state: RootState) => state.commentList.data)
  const createdAt = moment(post.createdAt, 'DD/MM/YYYY hh:mm').fromNow()
  const modifiedAt = moment(post.modifiedAt, 'DD/MM/YYYY hh:mm').fromNow()
  const [comments, setComments] = useState<Comment[]>([])
  const dispatch = useDispatch()

  useEffect(() => {
    const controller = new AbortController()
    post &&
      fetchApi.get(`commentsPost/${post.id}/0/0`, { signal: controller.signal }).then((res) => {
        detail ? dispatch(setCommentList(res.data)) : setComments(res.data)
      })
    return () => {
      controller.abort()
    }
  }, [post, detail, dispatch])

  useEffect(() => {
    const controller = new AbortController()
    socket.on('sendCommentNotify', (res: any) => {
      res.message !== '' &&
        fetchApi.get(`commentsPost/${post.id}/0/0`, { signal: controller.signal }).then((res) => {
          detail ? dispatch(setCommentList(res.data)) : setComments(res.data)
        })
    })
    return () => {
      controller.abort()
    }
  }, [dispatch, detail, post.id])

  return (
    <div
      className={`w-full px-8 py-4 bg-bg-light dark:bg-bg-dark rounded-md text-14 text-text-color dark:text-dark-text-color border border-solid border-border-color dark:border-dark-border-color ${
        detail ? 'rounded-br-none rounded-bl-none mt-8' : 'mb-8'
      }`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-start'>
          <Link to={`/${author && author.username}/profile/${author && author.id}/posts`}>
            <img
              loading='lazy'
              className='w-8 h-8 rounded-md object-cover'
              src={author?.avatar ? author?.avatar.url : userImg}
              alt={author?.firstName + ' ' + author?.lastName}
            />
          </Link>
          <div className='flex flex-col items-start justify-start ml-4'>
            <Link to={`/${author && author.username}/profile/${author && author.id}/posts`}>
              <span className='font-bold text-primary-color dark:text-dark-primary-color text-16'>
                {author?.firstName + ' ' + author?.lastName}
              </span>
            </Link>
            <div className='flex items-center justify-start'>
              <span className='mr-2'>{createdAt}</span>
              {post.type === 'public' ? (
                <FontAwesomeIcon icon={faEarthAmericas} className='text-title-color dark:text-dark-title-color' />
              ) : (
                <FontAwesomeIcon icon={faLock} className='text-title-color dark:text-dark-title-color' />
              )}
              {post.modifiedAt && <span className='ml-2 opacity-60'>Đã chỉnh sửa {modifiedAt}</span>}
            </div>
          </div>
        </div>
        {!detail && <SettingPost post={post} />}
      </div>
      <div className='my-2'>
        <p className={`mb-4 ${detail ? '' : 'line-clamp-3'} break-all`}>{post.content}</p>
        <div className={`${post.images?.length === 1 ? 'w-full' : 'grid grid-cols-2 gap-4'} mb-4`}>
          {(post.images as FilePreview[]).length > 0 &&
            post.images?.map((image, index) => (
              <img
                loading='lazy'
                key={index}
                className={`${post.images?.length === 1 ? 'h-[25rem]' : 'h-52'} w-full rounded-md object-cover`}
                src={image.url}
                alt={image.name}
              />
            ))}
        </div>

        {post.video?.name && (
          <div className='w-full'>
            <video className='rounded-md' src={post.video?.url} controls>
              <track src={post.video?.url} kind='captions' srcLang='en' label='English' />
            </video>
          </div>
        )}
      </div>
      <div className='flex items-center justify-around mt-4'>
        <button className='flex items-center justify-start'>
          <FontAwesomeIcon
            icon={faThumbsUp}
            className='text-title-color dark:text-dark-title-color text-20 rounded-full p-2 hover:bg-hover-color dark:hover:bg-dark-hover-color'
          />
          <span className='ml-2'>0</span>
        </button>
        <Link to={`/${author && author.username}/post/${post.id}`}>
          <button className='flex items-center justify-start'>
            <FontAwesomeIcon
              icon={faCommentDots}
              className='text-title-color dark:text-dark-title-color text-20 rounded-full p-2 hover:bg-hover-color dark:hover:bg-dark-hover-color'
            />
            <span className='ml-2'>{detail ? commentList.length : comments.length}</span>
          </button>
        </Link>
        <button className='flex items-center justify-start'>
          <FontAwesomeIcon
            icon={faShare}
            className='text-title-color dark:text-dark-title-color text-20 rounded-full p-2 hover:bg-hover-color dark:hover:bg-dark-hover-color'
          />
          <span className='ml-2'>0</span>
        </button>
      </div>
    </div>
  )
}
