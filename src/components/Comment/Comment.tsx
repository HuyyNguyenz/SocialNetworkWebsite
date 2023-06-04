import { useEffect } from 'react'
import { faEllipsis, faReply, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import userImg from '~/assets/images/user.png'
import { Comment, User } from '~/types'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import Tippy from '@tippyjs/react/headless'

interface Props {
  comment: Comment
  author: User
}

export default function Comment(props: Props) {
  const { comment, author } = props
  const userData = useSelector((state: RootState) => state.userData)
  const createdAt = moment(comment.createdAt, 'DD/MM/YYYY hh:mm').fromNow()
  const modifiedAt = moment(comment.modifiedAt, 'DD/MM/YYYY hh:mm').fromNow()

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, [])

  return (
    <div className='my-4'>
      <div className='flex items-start justify-start'>
        <img
          src={author.avatar ? author.avatar : userImg}
          alt={author.firstName + ' ' + author.lastName}
          className='w-8 h-8 object-cover rounded-full'
        />
        <div className='ml-4'>
          <div className='flex flex-col items-start justify-start bg-input-color rounded-md border border-solid border-border-color py-2 px-4'>
            <div className='mb-1 flex items-center justify-start'>
              <span className='text-primary-color font-bold'>
                {author.firstName} {author.lastName}
              </span>
              <span className='ml-2'>{createdAt}</span>
              {comment.modifiedAt && <span className='ml-2'>| Edited {modifiedAt}</span>}
            </div>
            <p className='break-all'>{comment.content}</p>
          </div>
          {comment.images && (
            <div className='mt-4 w-[16rem] h-[16rem]'>
              <img
                className='rounded-md object-cover w-full h-full'
                src={comment.images[0].url}
                alt={comment.images[0].name}
              />
            </div>
          )}
          {comment.video?.name && (
            <div className='mt-4 w-[26rem]'>
              <video className='rounded-md w-full h-full' src={comment.video.url} controls>
                <track src={comment.video.url} kind='captions' srcLang='en' label='English' />
              </video>
            </div>
          )}
          <div className='flex items-center justify-start py-2 px-4 text-16'>
            <button className='flex items-center justify-start mr-8'>
              <FontAwesomeIcon icon={faThumbsUp} className='hover:bg-hover-color rounded-full p-2' />
              <span className='ml-2 text-14'>0</span>
            </button>
            <button className='flex items-center justify-start mr-8'>
              <FontAwesomeIcon icon={faReply} className='hover:bg-hover-color rounded-full p-2' />
              <span className='ml-2 text-14'>0</span>
            </button>
            {userData.id === comment.userId && (
              <Tippy
                render={(attrs) => (
                  <div className='box' tabIndex={-1} {...attrs}>
                    My tippy box
                  </div>
                )}
              >
                <button className='flex items-center justify-start'>
                  <FontAwesomeIcon icon={faEllipsis} className='hover:bg-hover-color rounded-full p-2' />
                </button>
              </Tippy>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
