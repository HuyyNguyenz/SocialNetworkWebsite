import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import userImg from '~/assets/images/user.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceSmile, faImage } from '@fortawesome/free-regular-svg-icons'
import { faC, faFileVideo } from '@fortawesome/free-solid-svg-icons'
import { Comment, FilePreview, Message, Post } from '~/types'
import SectionPreview from '../SectionPreview'
import { toast } from 'react-toastify'
import useFileValidation from '~/hooks/useFileValidation'
import { deleteFile, uploadFile } from '~/utils/firebase'
import fetchApi from '~/utils/fetchApi'
import { cancelEditing, setNewPost, setSharePost } from '~/features/post/postSlice'
import { useParams } from 'react-router-dom'
import { cancelEditingComment, setCommentList } from '~/features/comment/commentSlice'
import Loading from '../Loading'
import Skeleton from 'react-loading-skeleton'
import socket from '~/socket'
import { cancelEditingMessage, setMessageList } from '~/features/message/messageSlice'
import EmojiPicker, { Theme } from 'emoji-picker-react'

interface Props {
  comment: boolean
  chatUserId?: number
  communityId?: number
  share?: string
  usersShare?: number[]
}

export default function TextEditor(props: Props) {
  const { comment, chatUserId, communityId, share, usersShare } = props
  const { postId } = useParams()
  const userData = useSelector((state: RootState) => state.userData)
  const editingPost = useSelector((state: RootState) => state.postList.editingPost)
  const editingComment = useSelector((state: RootState) => state.commentList.editingComment)
  const editingMessage = useSelector((state: RootState) => state.messageList.editingMessage)
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
  const [isOpenEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false)
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
        errorTextInput.innerText = `${
          comment ? 'Bình luận' : chatUserId ? 'Tin nhắn' : 'Bài viết'
        } đã đạt tối đa 400 ký tự`
      } else {
        errorTextInput.innerText = ''
      }
    } else {
      textInput?.classList.remove('h-[10rem]')
      errorTextInput.innerText = ''
    }
  }

  const handlePickerEmoji = (data: any) => {
    setPost((prev) => ({ ...prev, content: prev.content.length < 400 ? prev.content + data.emoji : prev.content }))
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

  const handleCancelEditing = () => {
    dispatch(chatUserId ? cancelEditingMessage() : comment ? cancelEditingComment() : cancelEditing())
    share && dispatch(setSharePost(null))
    textInput?.classList.remove('h-[10rem]')
    errorTextInput.innerText = ''
    // video.name = ''
    // video.src = ''
    // delete video.url
    // delete video.origin
    // while (images.length > 0) {
    //   images.pop()
    // }
    setPost(initialPost)
    setLoading(false)
  }

  const handleGetCommentList = async () => {
    const result: Comment[] = (await fetchApi.get(`commentsPost/${postId}/0/0`)).data
    dispatch(setCommentList(result))
  }

  const handleGetMessageList = async () => {
    const result: Message[] = (await fetchApi.get('messages')).data
    const messageList: Message[] = []
    result.forEach((message) => {
      message.friendId === userData.id && message.userId === chatUserId && messageList.push(message)
      message.friendId === chatUserId && message.userId === userData.id && messageList.push(message)
    })
    dispatch(setMessageList(messageList))
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
          const postUpdated = { ...post, modifiedAt: createdAt, userId: userId as number }
          postUpdated.images &&
            postUpdated.images.length > 0 &&
            postUpdated.images.forEach((image) => (image.origin = {} as File))
          postUpdated.video && postUpdated.video.origin && (postUpdated.video.origin = {} as File)
          toast(result.message, { autoClose: 2000, type: 'success', position: 'top-right' })
          dispatch(setNewPost(postUpdated))
        } else if (editingComment !== null && comment) {
          setLoading(true)
          if (images.length > 0 || video.name) {
            if (images.length > 0 && (editingComment.images?.length as number) > 0) {
              for await (const image of editingComment.images as FilePreview[]) {
                await deleteFile(image.name)
              }
            }
            if (video.name && editingComment.video?.name) {
              await deleteFile(editingComment.video?.name)
            }
            await handleUploadFile()
          }
          const { type, communityId, ...data } = post
          const comment = { ...data, postId }
          const result = (
            await fetchApi.put(`comment/${editingComment.id}`, { ...comment, modifiedAt: createdAt, userId })
          ).data
          toast(result.message, { autoClose: 2000, type: 'success', position: 'top-right' })
          handleGetCommentList()
        } else if (editingMessage !== null && chatUserId) {
          setLoading(true)
          if (images.length > 0 || video.name) {
            if (images.length > 0 && (editingMessage.images?.length as number) > 0) {
              for await (const image of editingMessage.images as FilePreview[]) {
                await deleteFile(image.name)
              }
            }
            if (video.name && editingMessage.video?.name) {
              await deleteFile(editingMessage.video?.name)
            }
            await handleUploadFile()
          }
          const { type, communityId, ...data } = post
          const message = { ...data, modifiedAt: createdAt, userId, friendId: chatUserId }
          const result = (await fetchApi.put(`message/${editingMessage.id}`, { ...message })).data
          toast(result.message, { autoClose: 2000, type: 'success', position: 'top-right' })
          result.message && socket.emit('sendMessageClient', { friendId: chatUserId })
        } else {
          await handleUploadFile()
          if (comment) {
            if (chatUserId) {
              const { type, communityId, ...data } = post
              const message = { ...data, createdAt, userId, friendId: chatUserId }
              const result = (await fetchApi.post('message', { ...message })).data
              result.message && socket.emit('sendMessageClient', { friendId: chatUserId, status: 'new message' })
            } else {
              const { type, communityId, ...data } = post
              const comment = { ...data, postId }
              const result = (await fetchApi.post('comment', { ...comment, createdAt, userId })).data
              toast(result.message, { autoClose: 2000, type: 'success', position: 'top-right' })
              handleGetCommentList()
              socket.emit('sendDataClient', { ...comment, createdAt, userId })
            }
          } else {
            if (usersShare && usersShare.length > 0) {
              usersShare.forEach(async (userFriendId) => {
                const { type, communityId, ...data } = post
                const message = {
                  ...data,
                  content: share ? post.content + ' ' + share : post.content,
                  createdAt,
                  userId,
                  friendId: Number(userFriendId)
                }
                const result = (await fetchApi.post('message', { ...message })).data
                if (share) {
                  const postId = Number(share.split('/post/')[1])
                  await fetchApi.post('share/post', { userId: userData.id, postId, type: 'shareTo' })
                }
                result.message &&
                  socket.emit('sendMessageClient', { friendId: Number(userFriendId), status: 'new message' })
              })
            } else if (usersShare && usersShare.length === 0) {
              toast('Vui lòng chọn người dùng cần chia sẻ', {
                autoClose: 2000,
                type: 'warning',
                position: 'top-right'
              })
              setLoading(false)
              return
            } else {
              const result = (
                await fetchApi.post('post', {
                  ...post,
                  content: share ? post.content + ' ' + share : post.content,
                  createdAt,
                  userId
                })
              ).data
              if (share) {
                const postId = Number(share.split('/post/')[1])
                await fetchApi.post('share/post', { userId: userData.id, postId, type: 'share' })
              }
              !share &&
                toast(result.message, {
                  autoClose: 2000,
                  type: 'success',
                  position: 'top-right'
                })
              dispatch(setNewPost(result.post))
            }
          }
        }
        handleCancelEditing()
        handleGetMessageList()
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

  useEffect(() => {
    if (comment && editingComment !== null) {
      setPost({ ...editingComment, communityId: 0, type: '' })
      window.scrollTo(0, 9999)
    }
  }, [editingComment, comment])

  useEffect(() => {
    if (chatUserId && editingMessage !== null) {
      setPost({ ...editingMessage, communityId: 0, type: '' })
      window.scrollTo(0, 9999)
    }
  }, [editingMessage, chatUserId])

  return (
    <>
      <div
        className={`${
          comment ? '' : 'py-4 px-8 border border-solid border-border-color dark:border-dark-border-color rounded-md'
        } flex items-start justify-start bg-bg-light dark:bg-bg-dark text-14 ${comment ? '' : 'mb-8'}`}
      >
        <button className='mr-4'>
          <img
            loading='lazy'
            className='w-8 h-8 object-cover rounded-md'
            src={userData.avatar ? userData.avatar.url : userImg}
            alt={`${userData.firstName} ${userData.lastName}`}
          />
        </button>
        <div className='w-full flex-1'>
          <form method='POST' onSubmit={handleSubmit} onReset={handleCancelEditing}>
            {comment || communityId || share ? (
              ''
            ) : (
              <select
                onChange={handleSelect}
                value={post.type}
                name='typePost'
                id='typePost'
                className='outline-none pr-2 mb-2 text-primary-color dark:text-dark-primary-color font-bold cursor-pointer dark:bg-bg-dark'
              >
                <option className='font-bold' value='public'>
                  Công khai
                </option>
                <option className='font-bold' value='private'>
                  Riêng tư
                </option>
              </select>
            )}

            <textarea
              onFocus={() => setOpenEmojiPicker(false)}
              maxLength={400}
              onChange={handleChange}
              value={post.content}
              spellCheck={false}
              name='textInput'
              id='textInput'
              className='w-full rounded-md border border-solid dark:bg-dark-input-color dark:text-dark-text-color border-border-color dark:border-dark-border-color outline-none px-4 pt-2 resize-none scrollbar-hidden text-left'
              placeholder={
                comment && !chatUserId
                  ? 'Hãy nêu cảm nghĩ của bạn 😊'
                  : comment && chatUserId
                  ? 'Nhập nội dung tại đây 🖊️'
                  : 'Bạn đang cảm thấy như thế nào 🤔'
              }
            />
            <span className='text-red-600 error-text-input'></span>

            {share ? null : isLoading ? (
              <Skeleton className={`${chatUserId ? 'h-52 w-72' : 'h-[25rem]'} mb-2 dark:bg-bg-dark`} />
            ) : (
              <>
                {(post.images?.length as number) > 0 && (
                  <SectionPreview
                    data={post.images as FilePreview[]}
                    deleteItem={handleDelete}
                    chatUserId={chatUserId}
                  />
                )}
                {post.video?.name && (
                  <SectionPreview data={post.video as FilePreview} deleteItem={handleDelete} chatUserId={chatUserId} />
                )}
              </>
            )}

            <div className='flex items-center justify-end text-primary-color dark:text-dark-primary-color text-16 font-semibold'>
              {isLoading ? null : (
                <>
                  <button
                    type='button'
                    onClick={() => setOpenEmojiPicker(!isOpenEmojiPicker)}
                    className='py-2 w-10 rounded-full hover:bg-gradient-to-r from-primary-color dark:from-dark-primary-color to-secondary-color dark:to-secondary-color hover:text-white'
                  >
                    <FontAwesomeIcon icon={faFaceSmile} />
                  </button>
                  {!share && (
                    <>
                      <div className='ml-4 flex items-center justify-start'>
                        <label
                          htmlFor='images'
                          className='w-10 py-2 text-center rounded-full hover:bg-gradient-to-r from-primary-color dark:from-dark-primary-color to-secondary-color dark:to-secondary-color hover:text-white cursor-pointer'
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
                      <div className='ml-4 flex items-center justify-start'>
                        <label
                          htmlFor='video'
                          className='w-10 py-2 text-center rounded-full hover:bg-gradient-to-r from-primary-color dark:from-dark-primary-color to-secondary-color dark:to-secondary-color hover:text-white cursor-pointer'
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
                    </>
                  )}
                </>
              )}
              {(editingPost || editingComment || editingMessage) && !isLoading && (
                <button type='reset' id='btnReset' className='ml-4 px-2 py-1'>
                  Huỷ
                </button>
              )}
              {isLoading ? (
                <button
                  disabled
                  className='ml-4 text-white bg-gradient-to-r from-primary-color dark:from-dark-primary-color to-secondary-color dark:to-secondary-color rounded-md px-6 py-1 opacity-50'
                >
                  <FontAwesomeIcon className='animate-spin mr-2' icon={faC} />
                  <span>Đang xử lý</span>
                </button>
              ) : (
                <button
                  id='btnSubmit'
                  className='ml-4 text-white bg-gradient-to-r from-primary-color dark:from-dark-primary-color to-secondary-color dark:to-secondary-color rounded-md px-6 py-1 opacity-20 cursor-not-allowed'
                >
                  {editingPost || editingComment || editingMessage
                    ? 'Cập nhật'
                    : comment && !chatUserId
                    ? 'Bình luận'
                    : comment && chatUserId
                    ? 'Gửi'
                    : share
                    ? 'Chia sẻ'
                    : 'Đăng bài'}
                </button>
              )}
            </div>
            {isOpenEmojiPicker && (
              <EmojiPicker
                onEmojiClick={handlePickerEmoji}
                theme={localStorage.getItem('theme') === 'dark' ? Theme.DARK : Theme.LIGHT}
              />
            )}
          </form>
        </div>
      </div>
      {!comment && isLoading && <Loading quantity={1} />}
    </>
  )
}
