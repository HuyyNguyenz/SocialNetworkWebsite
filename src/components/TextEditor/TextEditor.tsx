import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import userImg from '~/assets/images/user.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { faC, faFileVideo } from '@fortawesome/free-solid-svg-icons'
import Skeleton from 'react-loading-skeleton'
import { FilePreview, Posts } from '~/types'
import SectionPreview from '../SectionPreview'
import { toast } from 'react-toastify'
import useFileValidation from '~/hooks/useFileValidation'
import { uploadFile } from '~/utils/firebase'
import fetchApi from '~/utils/fetchApi'
import { setPostsList } from '~/features/posts/postsSlice'

export default function TextEditor() {
  const userData = useSelector((state: RootState) => state.userData)
  const initialPosts: Posts = {
    content: '',
    createdAt: '',
    userId: 0,
    communityId: 0,
    type: 'public',
    images: undefined,
    video: undefined
  }
  const [posts, setPosts] = useState<Posts>(initialPosts)
  const [isLoading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const [images, video, error, handleValidation] = useFileValidation()
  const textInput = document.getElementById('textInput')
  const btnSubmit = document.getElementById('btnSubmit')

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPosts((prev) => ({ ...prev, content: prev.content === '' ? event.target.value.trim() : event.target.value }))
    if (event.target.value.length > 100) {
      textInput?.classList.add('h-[10rem]')
    } else {
      textInput?.classList.remove('h-[10rem]')
    }
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPosts((prev) => ({ ...prev, type: event.target.value }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleValidation(event)
  }

  const handleDeleteImage = (id: string) => {
    if (id === '') {
      URL.revokeObjectURL(video.src)
      video.name = ''
      video.src = ''
      setPosts((prev) => ({ ...prev, video }))
    } else {
      const index = images.findIndex((item) => item.id === id)
      URL.revokeObjectURL(images[index].src)
      images.splice(index, 1)
      setPosts((prev) => ({ ...prev, images }))
    }
  }

  const handleClearPreValue = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element = event.target as HTMLInputElement
    element.value = ''
  }

  const handleUploadFile = async () => {
    setLoading(true)
    if (posts.images) {
      for await (const image of posts.images) {
        const url = await uploadFile(image.origin as File, 'images')
        image.url = url
      }
    }
    if (posts.video?.name) {
      const url = await uploadFile(posts.video?.origin as File, 'videos')
      video.url = url
    }
    setPosts((prev) => ({ ...prev, images, video }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (posts.content || (posts.images?.length as number) > 0 || posts.video?.name) {
      const date = new Date()
      const createdAt = `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}/${
        date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      }/${date.getFullYear()} ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      }`
      const userId = userData.id
      try {
        await handleUploadFile()
        const result = (await fetchApi.post('posts', { ...posts, createdAt, userId })).data
        toast(result.message, { autoClose: 2000, type: 'success', position: 'top-right' })
        video.name = ''
        video.src = ''
        delete video.url
        delete video.origin
        images.splice(0, images.length)
        setPosts(initialPosts)
        setLoading(false)
        handleGetPostsList()
      } catch (error: any) {
        throw error.response
      }
    }
  }

  const handleGetPostsList = async () => {
    const result: Posts[] = (await fetchApi.get('posts')).data
    dispatch(setPostsList(result))
  }

  useEffect(() => {
    if ((posts.images?.length as number) > 0 || posts.content || posts.video?.name) {
      btnSubmit?.classList.remove('cursor-not-allowed', 'opacity-20')
      btnSubmit?.classList.add('hover:opacity-90')
    } else {
      btnSubmit?.classList.remove('hover:opacity-90')
      btnSubmit?.classList.add('cursor-not-allowed', 'opacity-20')
    }
  }, [posts, btnSubmit])

  useEffect(() => {
    if (error.image) {
      toast(error.image, { type: 'info', autoClose: 2000, position: 'bottom-center' })
    } else {
      setPosts((prev) => ({ ...prev, images }))
    }
  }, [error.image, images])

  useEffect(() => {
    if (error.video) {
      toast(error.video, { type: 'info', autoClose: 2000, position: 'bottom-center' })
    } else {
      setPosts((prev) => ({ ...prev, video }))
    }
  }, [error.video, video])

  useEffect(() => {
    return () => {
      if (posts.images) {
        posts.images.length > 0 && posts.images.forEach((image) => URL.revokeObjectURL(image.src))
      }
    }
  }, [posts.images])

  useEffect(() => {
    return () => {
      if (posts.video) {
        posts.video.name && URL.revokeObjectURL(posts.video.src)
      }
    }
  }, [posts.video])

  return (
    <>
      <div className='flex items-start justify-start bg-white border border-solid border-border-color rounded-md py-4 px-8 text-14'>
        <button className='mr-4'>
          <img
            className='w-8 h-8 object-cover rounded-full'
            src={userData.avatar ? userData.avatar : userImg}
            alt={`${userData.firstName} ${userData.lastName}`}
          />
        </button>
        <div className='w-full'>
          <form onSubmit={handleSubmit}>
            <select
              onChange={handleSelect}
              value={posts.type}
              name='typePosts'
              id='typePosts'
              className='outline-none pr-2 mb-2 text-primary-color font-bold cursor-pointer'
            >
              <option value='public'>Công khai</option>
              <option value='private'>Riêng tư</option>
            </select>

            <textarea
              maxLength={400}
              onChange={handleChange}
              value={posts.content}
              spellCheck={false}
              name='textInput'
              id='textInput'
              className='w-full rounded-md border border-solid border-border-color outline-none px-4 pt-2 resize-none scroll-hidden text-left'
              placeholder='Bạn đang cảm thấy như thế nào ?'
            />

            {(posts.images?.length as number) > 0 && (
              <SectionPreview data={posts.images as FilePreview[]} deleteItem={handleDeleteImage} />
            )}
            {posts.video?.name && <SectionPreview data={posts.video as FilePreview} deleteItem={handleDeleteImage} />}

            <div className='flex items-center justify-end text-primary-color text-16 font-semibold'>
              <div className='flex items-center justify-start'>
                <label
                  htmlFor='images'
                  className='w-10 py-2 text-center rounded-full hover:bg-gradient-to-r from-primary-color to-secondary-color hover:text-white cursor-pointer'
                >
                  <FontAwesomeIcon icon={faImage} />
                </label>
                <input
                  multiple
                  onChange={handleFileChange}
                  onClick={handleClearPreValue}
                  type='file'
                  name='images'
                  id='images'
                  className='hidden'
                />
              </div>
              <div className='ml-8 flex items-center justify-start'>
                <label
                  htmlFor='video'
                  className='w-10 py-2 text-center rounded-full hover:bg-gradient-to-r from-primary-color to-secondary-color hover:text-white cursor-pointer'
                >
                  <FontAwesomeIcon icon={faFileVideo} />
                </label>
                <input
                  onChange={handleFileChange}
                  onClick={handleClearPreValue}
                  type='file'
                  name='video'
                  id='video'
                  className='hidden'
                />
              </div>
              {isLoading ? (
                <button
                  disabled
                  className='ml-8 text-white bg-gradient-to-r from-primary-color to-secondary-color rounded-md px-6 py-1 opacity-50'
                >
                  <FontAwesomeIcon className='animate-spin mr-2' icon={faC} />
                  <span>Đang xử lý</span>
                </button>
              ) : (
                <button
                  id='btnSubmit'
                  className='ml-8 text-white bg-gradient-to-r from-primary-color to-secondary-color rounded-md px-6 py-1 opacity-20 cursor-not-allowed'
                >
                  Đăng bài
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      {isLoading && (
        <div className='flex items-start justify-start w-full py-4 px-8'>
          <Skeleton circle className='w-8 h-8 mr-4' />
          <Skeleton count={5} className='w-[41rem]' />
        </div>
      )}
    </>
  )
}
