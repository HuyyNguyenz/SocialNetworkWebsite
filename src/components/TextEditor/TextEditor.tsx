import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import userImg from '~/assets/images/user.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { faC, faFileVideo } from '@fortawesome/free-solid-svg-icons'
import { Comment, FilePreview, Post } from '~/types'
import SectionPreview from '../SectionPreview'
import { toast } from 'react-toastify'
import useFileValidation from '~/hooks/useFileValidation'
import { deleteFile, uploadFile } from '~/utils/firebase'
import fetchApi from '~/utils/fetchApi'
import { cancelEditing, setPostList } from '~/features/post/postSlice'
import { useParams } from 'react-router-dom'
import { setCommentList } from '~/features/comment/commentSlice'
import Loading from '../Loading'

interface Props {
  comment: boolean
}

export default function TextEditor(props: Props) {
  const { comment } = props
  const { postId } = useParams()
  const userData = useSelector((state: RootState) => state.userData)
  const editingPost = useSelector((state: RootState) => state.postList.editingPost)
  const initialPost: Post = {
    content: '',
    createdAt: '',
    userId: 0,
    communityId: 0,
    type: 'public',
    images: undefined,
    video: undefined
  }
  const [post, setPost] = useState<Post>(initialPost)
  const [isLoading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const [images, video, error, handleValidation] = useFileValidation()
  const textInput = document.getElementById('textInput')
  const errorTextInput = document.querySelector('.error-text-input') as HTMLSpanElement
  const btnSubmit = document.getElementById('btnSubmit')

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost((prev) => ({ ...prev, content: prev.content === '' ? event.target.value.trim() : event.target.value }))
    if (event.target.value.length > 100) {
      textInput?.classList.add('h-[10rem]')
      if (event.target.value.length === 400) {
        errorTextInput.innerText = `${comment ? 'Bình luận' : 'Bài viết'} đã đạt tối đa 400 ký tự`
      } else {
        errorTextInput.innerText = ''
      }
    } else {
      textInput?.classList.remove('h-[10rem]')
      errorTextInput.innerText = ''
    }
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPost((prev) => ({ ...prev, type: event.target.value }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleValidation(event)
  }

  const handleDelete = (id: string) => {
    if (id === '') {
      URL.revokeObjectURL(video.src)
      video.name = ''
      video.src = ''
      video.url = ''
      setPost((prev) => ({ ...prev, video }))
    } else {
      if (editingPost !== null) {
        const images = Array.from(post.images as FilePreview[]).filter((image) => image.id !== id)
        setPost((prev) => ({ ...prev, images }))
      } else {
        const index = images.findIndex((item) => item.id === id)
        URL.revokeObjectURL(images[index].src)
        images.splice(index, 1)
        setPost((prev) => ({ ...prev, images }))
      }
    }
  }

  const handleClearPreValue = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element = event.target as HTMLInputElement
    element.value = ''
  }

  const handleUploadFile = async () => {
    setLoading(true)
    if (images.length > 0) {
      for await (const image of images) {
        const result = await uploadFile(image.origin as File, 'images')
        image.url = result.url
        image.name = result.pathName
        image.src = ''
      }
    }
    if (video.name) {
      const result = await uploadFile(video.origin as File, 'videos')
      video.url = result.url
      video.name = result.pathName
      video.src = ''
    }
    setPost((prev) => ({ ...prev, images, video }))
  }

  const handleGetPostList = async () => {
    const result: Post[] = (await fetchApi.get('posts')).data
    dispatch(setPostList(result))
  }

  const handleCancelEditing = () => {
    dispatch(cancelEditing())
    textInput?.classList.remove('h-[10rem]')
    errorTextInput.innerText = ''
    video.name = ''
    video.src = ''
    delete video.url
    delete video.origin
    images.splice(0, images.length)
    setPost(initialPost)
    setLoading(false)
  }

  const handleGetCommentList = async () => {
    const result: Comment[] = (await fetchApi.get('comments')).data
    dispatch(setCommentList(result))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (post.content || (post.images?.length as number) > 0 || post.video?.name) {
      const date = new Date()
      const createdAt = `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}/${
        date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      }/${date.getFullYear()} ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      }`
      const userId = userData.id
      try {
        if (editingPost !== null) {
          setLoading(true)
          if (images.length > 0 || video.name) {
            if (images.length > 0 && (editingPost.images?.length as number) > 0) {
              for await (const image of editingPost.images as FilePreview[]) {
                await deleteFile(image.name)
              }
            }
            if (video.name && editingPost.video?.name) {
              await deleteFile(editingPost.video?.name)
            }
            await handleUploadFile()
          }
          const result = (await fetchApi.put(`post/${post.id}`, { ...post, modifiedAt: createdAt, userId })).data
          toast(result.message, { autoClose: 2000, type: 'success', position: 'top-right' })
        } else {
          await handleUploadFile()
          if (comment) {
            const { type, communityId, ...data } = post
            const comment = { ...data, postId }
            const result = (await fetchApi.post('comment', { ...comment, createdAt, userId })).data
            toast(result.message, { autoClose: 2000, type: 'success', position: 'top-right' })
          } else {
            const result = (await fetchApi.post('post', { ...post, createdAt, userId })).data
            toast(result.message, { autoClose: 2000, type: 'success', position: 'top-right' })
          }
        }
        handleCancelEditing()
        handleGetPostList()
        handleGetCommentList()
      } catch (error: any) {
        throw error.response
      }
    }
  }

  useEffect(() => {
    if ((post.images?.length as number) > 0 || post.content || post.video?.name) {
      btnSubmit?.classList.remove('cursor-not-allowed', 'opacity-20')
      btnSubmit?.classList.add('hover:opacity-90')
    } else {
      btnSubmit?.classList.remove('hover:opacity-90')
      btnSubmit?.classList.add('cursor-not-allowed', 'opacity-20')
    }
  }, [post, btnSubmit])

  useEffect(() => {
    if (error.image) {
      toast(error.image, { type: 'info', autoClose: 2000, position: 'bottom-center' })
    } else {
      setPost((prev) => ({ ...prev, images }))
    }
  }, [error.image, images])

  useEffect(() => {
    if (error.video) {
      toast(error.video, { type: 'info', autoClose: 2000, position: 'bottom-center' })
    } else {
      setPost((prev) => ({ ...prev, video }))
    }
  }, [error.video, video])

  useEffect(() => {
    return () => {
      if (post.images) {
        post.images.length > 0 && post.images.forEach((image) => URL.revokeObjectURL(image.src))
      }
    }
  }, [post.images])

  useEffect(() => {
    return () => {
      if (post.video) {
        post.video.name && URL.revokeObjectURL(post.video.src)
      }
    }
  }, [post.video])

  useEffect(() => {
    if (editingPost !== null) {
      setPost(editingPost)
      window.scrollTo(0, 0)
    }
  }, [editingPost])

  return (
    <>
      <div
        className={`${
          comment ? '' : 'py-4 px-8 border border-solid border-border-color rounded-md'
        } flex items-start justify-start bg-white text-14`}
      >
        <button className='mr-4'>
          <img
            className='w-8 h-8 object-cover rounded-full'
            src={userData.avatar ? userData.avatar : userImg}
            alt={`${userData.firstName} ${userData.lastName}`}
          />
        </button>
        <div className='w-full'>
          <form method='POST' onSubmit={handleSubmit} onReset={handleCancelEditing}>
            {comment ? (
              ''
            ) : (
              <select
                onChange={handleSelect}
                value={post.type}
                name='typePost'
                id='typePost'
                className='outline-none pr-2 mb-2 text-primary-color font-bold cursor-pointer'
              >
                <option value='public'>Công khai</option>
                <option value='private'>Riêng tư</option>
              </select>
            )}

            <textarea
              maxLength={400}
              onChange={handleChange}
              value={post.content}
              spellCheck={false}
              name='textInput'
              id='textInput'
              className='w-full rounded-md border border-solid border-border-color outline-none px-4 pt-2 resize-none scroll-hidden text-left'
              placeholder={comment ? 'Hãy nêu cảm nghĩ của bạn' : 'Bạn đang cảm thấy như thế nào ?'}
            />
            <span className='text-red-600 error-text-input'></span>

            {(post.images?.length as number) > 0 && (
              <SectionPreview data={post.images as FilePreview[]} deleteItem={handleDelete} />
            )}
            {post.video?.name && <SectionPreview data={post.video as FilePreview} deleteItem={handleDelete} />}

            <div className='flex items-center justify-end text-primary-color text-16 font-semibold'>
              <div className='flex items-center justify-start'>
                <label
                  htmlFor='images'
                  className='w-10 py-2 text-center rounded-full hover:bg-gradient-to-r from-primary-color to-secondary-color hover:text-white cursor-pointer'
                >
                  <FontAwesomeIcon icon={faImage} />
                </label>
                <input
                  multiple={comment ? false : true}
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
              {editingPost && (
                <button type='reset' id='btnReset' className='ml-8 px-2 py-1'>
                  Huỷ
                </button>
              )}
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
                  {editingPost ? 'Cập nhật' : comment ? 'Bình luận' : 'Đăng bài'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      {!comment && isLoading && <Loading quantity={1} />}
    </>
  )
}
