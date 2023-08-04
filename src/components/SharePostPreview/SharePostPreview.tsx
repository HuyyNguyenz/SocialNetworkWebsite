import { useEffect } from 'react'
import { Post, User } from '~/types'
import PostItem from '../PostItem'
import TextEditor from '../TextEditor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

interface Props {
  post: Post
  author: User
  type: string
  cancelled: (value: boolean) => void
}

export default function SharePostPreview(props: Props) {
  const { post, author, type } = props
  const sharePost = useSelector((state: RootState) => state.postList.sharePost)

  useEffect(() => {
    sharePost === null && props.cancelled(true)
  }, [sharePost, props])

  return (
    <>
      <div className='center px-10 fixed z-[60] w-[48rem] h-[80%] animate-fade bg-input-color dark:bg-dark-input-color rounded-md border border-solid border-border-color dark:border-dark-border-color overflow-y-auto'>
        <div className='flex items-center justify-between w-full py-4 text-title-color dark:text-dark-title-color text-18 font-semibold'>
          <h4>{type}</h4>
          <button
            onClick={() => props.cancelled(true)}
            className='w-10 py-2 rounded-full hover:bg-hover-color dark:hover:bg-dark-hover-color'
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <TextEditor comment={false} share={`${import.meta.env.VITE_HOST_URL}${author.username}/post/${post.id}`} />
        <PostItem post={post} author={author} detail={false} share={true} />
      </div>
      <div className='overlay'></div>
    </>
  )
}
