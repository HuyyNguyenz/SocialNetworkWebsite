import { useEffect, useState } from 'react'
import { FilePreview, Posts, User } from '~/types'
import moment from 'moment'
import userImg from '~/assets/images/user.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots, faEarthAmericas, faEllipsis, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import fetchApi from '~/utils/fetchApi'

interface Props {
  postsList: Posts[]
}

export default function Posts(props: Props) {
  const { postsList } = props
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (users.length === 0) {
      const controller = new AbortController()
      fetchApi.get('users', { signal: controller.signal }).then((res) => setUsers(res.data))
      return () => {
        controller.abort()
      }
    }
  }, [users])

  const handleFindAuthor = (id: number) => {
    return users.find((user) => user.id === id)
  }

  return (
    <section>
      {postsList.length > 0 &&
        postsList.map((posts) => {
          const user = handleFindAuthor(posts.userId) as User
          const createdAt = moment(posts.createdAt).fromNow()
          return (
            <div
              key={posts.id}
              className='w-full px-8 py-4 bg-white rounded-md text-14 text-text-color border border-solid border-border-color mt-8'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start'>
                  <img
                    className='w-8 h-8 rounded-full object-cover'
                    src={user?.avatar ? user?.avatar : userImg}
                    alt={user?.firstName + ' ' + user?.lastName}
                  />
                  <div className='flex flex-col items-start justify-start ml-4'>
                    <span className='font-bold text-primary-color text-16'>
                      {user?.firstName + ' ' + user?.lastName}
                    </span>
                    <div className='flex items-center justify-start'>
                      <span className='mr-2'>{createdAt}</span>
                      <FontAwesomeIcon icon={faEarthAmericas} className='text-title-color' />
                    </div>
                  </div>
                </div>
                <button>
                  <FontAwesomeIcon icon={faEllipsis} className='text-20 text-title-color' />
                </button>
              </div>
              <div className='my-2'>
                <p className='mb-4'>{posts.content}</p>
                <div className={`${posts.images?.length === 1 ? 'w-full' : 'grid grid-cols-2 gap-4'} mb-4`}>
                  {(posts.images as FilePreview[]).length > 0 &&
                    posts.images?.map((image, index) => (
                      <img
                        key={index}
                        className={`${
                          posts.images?.length === 1 ? 'h-[25rem]' : 'h-52'
                        } w-full rounded-md object-cover`}
                        src={image.url}
                        alt={image.name}
                      />
                    ))}
                </div>

                {posts.video?.name && (
                  <div className='w-full h-[25rem]'>
                    <video className='rounded-md' src={posts.video?.url} controls>
                      <track src={posts.video?.url} kind='captions' srcLang='en' label='English' />
                    </video>
                  </div>
                )}
              </div>
              <div className='flex items-center justify-around mt-4'>
                <button className='flex items-center justify-start'>
                  <FontAwesomeIcon icon={faThumbsUp} className='text-title-color text-20' />
                  <span className='ml-2'>10</span>
                </button>
                <button className='flex items-center justify-start'>
                  <FontAwesomeIcon icon={faCommentDots} className='text-title-color text-20' />
                  <span className='ml-2'>10</span>
                </button>
                <button className='flex items-center justify-start'>
                  <FontAwesomeIcon icon={faShare} className='text-title-color text-20' />
                  <span className='ml-2'>10</span>
                </button>
              </div>
            </div>
          )
        })}
    </section>
  )
}
