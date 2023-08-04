import { useState } from 'react'
import Tippy from '@tippyjs/react/headless'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faShare } from '@fortawesome/free-solid-svg-icons'
import { Post, User } from '~/types'
import SharePostPreview from '../SharePostPreview'
import { useDispatch, useSelector } from 'react-redux'
import { setSharePost } from '~/features/post/postSlice'
import { toast } from 'react-toastify'
import { RootState } from '~/store'

interface Props {
  post: Post
  author: User
}

export default function ShareOption(props: Props) {
  const { post, author } = props
  const sharePost = useSelector((state: RootState) => state.postList.sharePost)
  const [isOpen, setOpen] = useState<boolean>(false)
  const [isShowSharePostPreview, setShowSharePostPreview] = useState<boolean>(false)
  const [shareType, setShareType] = useState<string>('')
  const dispatch = useDispatch()

  const handleShareImmediately = () => {
    dispatch(setSharePost(post))
    setShareType('Chia sẻ ngay (Công khai)')
    setShowSharePostPreview(true)
    document.body.classList.add('overflow-hidden')
  }

  return (
    <div>
      <Tippy
        onClickOutside={() => setOpen(false)}
        visible={isOpen}
        interactive
        placement='bottom-end'
        zIndex={10}
        render={(attrs) => (
          <div
            className='flex flex-col items-start justify-start bg-bg-light dark:bg-bg-dark rounded-md border border-solid border-border-color dark:border-dark-border-color text-14 py-4 shadow-md animate-fade'
            tabIndex={-1}
            {...attrs}
          >
            <button
              onClick={handleShareImmediately}
              className='flex items-center justify-start py-2 px-4 mb-2 hover:bg-hover-color dark:hover:bg-dark-hover-color w-full'
            >
              <FontAwesomeIcon icon={faShare} />
              <span className='ml-2'>Chia sẻ ngay (Công khai)</span>
            </button>
            <button className='flex items-center justify-start py-2 px-4 hover:bg-hover-color dark:hover:bg-dark-hover-color w-full'>
              <FontAwesomeIcon icon={faMessage} />
              <span className='ml-2'>Chia sẻ qua tin nhắn</span>
            </button>
          </div>
        )}
      >
        <button onClick={() => setOpen(!isOpen)}>
          <FontAwesomeIcon
            icon={faShare}
            className='text-title-color dark:text-dark-title-color text-20 rounded-full p-2 hover:bg-hover-color dark:hover:bg-dark-hover-color'
          />
        </button>
      </Tippy>
      {isShowSharePostPreview && (
        <SharePostPreview
          post={post}
          author={author}
          type={shareType}
          cancelled={(isClosed) => {
            isClosed && setShowSharePostPreview(false)
            sharePost === null &&
              toast('Chia sẻ bài viết thành công', {
                autoClose: 2000,
                type: 'success',
                position: 'top-right'
              })
            dispatch(setSharePost(null))
            document.body.classList.remove('overflow-hidden')
          }}
        />
      )}
    </div>
  )
}
