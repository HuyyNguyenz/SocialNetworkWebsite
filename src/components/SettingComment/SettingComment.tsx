import { useState } from 'react'
import Tippy from '@tippyjs/react/headless'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Comment, FilePreview, Message } from '~/types'
import { confirmAlert } from 'react-confirm-alert'
import { useDispatch, useSelector } from 'react-redux'
import { deleteComment, startEditingComment } from '~/features/comment/commentSlice'
import fetchApi from '~/utils/fetchApi'
import { toast } from 'react-toastify'
import { deleteFile } from '~/utils/firebase'
import { deleteMessage, startEditingMessage } from '~/features/message/messageSlice'
import socket from '~/utils/socket'
import { RootState } from '~/store'

interface Props {
  comment?: Comment
  message?: Message
}

export default function SettingComment(props: Props) {
  const { comment, message } = props
  const userData = useSelector((state: RootState) => state.userData.data)
  const [isOpenSetting, setOpenSetting] = useState<boolean>(false)
  const dispatch = useDispatch()

  const handleDeleteComment = () => {
    confirmAlert({
      title: 'Xác nhận để xoá bình luận',
      message: 'Bạn có chắc là muốn xoá bình luận ?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: async () => {
            const commentDeleted = { ...comment }
            commentDeleted.deleted = 1
            const result = (await fetchApi.delete(`comment/${comment?.id}`)).data
            dispatch(deleteComment(commentDeleted as Comment))
            toast(result.message, { autoClose: 2000, type: 'success', position: 'top-right' })
            if ((comment?.images?.length as number) > 0) {
              for await (const image of comment?.images as FilePreview[]) {
                await deleteFile(image.name)
              }
            }
            if (comment?.video?.name) {
              await deleteFile(comment.video.name)
            }
          }
        },
        {
          label: 'Huỷ'
        }
      ]
    })
  }

  const handleDeleteMessage = () => {
    confirmAlert({
      title: 'Xác nhận để gỡ tin nhắn',
      message: 'Bạn có chắc là muốn gỡ tin nhắn ?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: async () => {
            const messageDeleted = { ...(message as Message) }
            messageDeleted.deleted = 1
            dispatch(deleteMessage(messageDeleted))
            const result = (await fetchApi.delete(`message/${message?.id}`)).data
            toast(result.message, { autoClose: 2000, type: 'success', position: 'top-right' })
            if ((message?.images?.length as number) > 0) {
              for await (const image of message?.images as FilePreview[]) {
                await deleteFile(image.name)
              }
            }
            if (message?.video?.name) {
              await deleteFile(message.video.name)
            }
            socket.emit('sendMessageClient', { friendId: message?.friendId })
          }
        },
        {
          label: 'Huỷ'
        }
      ]
    })
  }

  const handleEditingComment = () => {
    dispatch(startEditingComment(comment as Comment))
    setOpenSetting(false)
  }

  const handleEditingMessage = () => {
    dispatch(startEditingMessage(message as Message))
    setOpenSetting(false)
  }

  return (
    <div>
      <Tippy
        zIndex={10}
        placement={message ? 'left-start' : 'right-start'}
        onClickOutside={() => setOpenSetting(false)}
        visible={isOpenSetting}
        interactive
        render={(attrs) => (
          <div
            className='flex flex-col items-start justify-start bg-bg-light dark:bg-bg-dark border border-solid border-border-color dark:border-dark-border-color shadow-md rounded-md py-2 text-14 text-text-color dark:text-dark-text-color'
            tabIndex={-1}
            {...attrs}
          >
            {(userData.id === comment?.userId || userData.id === message?.userId) && (
              <button
                onClick={message ? handleEditingMessage : handleEditingComment}
                className='flex items-center justify-start w-full px-4 py-2 hover:bg-hover-color dark:hover:bg-dark-hover-color'
              >
                <FontAwesomeIcon icon={faPencil} />
                <span className='ml-2'>Chỉnh sửa</span>
              </button>
            )}
            <button
              onClick={message ? handleDeleteMessage : handleDeleteComment}
              className='flex items-center justify-start w-full px-4 py-2 hover:bg-hover-color dark:hover:bg-dark-hover-color'
            >
              <FontAwesomeIcon icon={faTrash} />
              <span className='ml-2'>{message ? 'Gỡ tin nhắn' : 'Xoá'}</span>
            </button>
          </div>
        )}
      >
        <button
          onClick={() => setOpenSetting(!isOpenSetting)}
          className='text-title-color dark:text-dark-title-color flex items-center justify-start'
        >
          <FontAwesomeIcon
            icon={faEllipsis}
            className='hover:bg-hover-color dark:hover:bg-dark-hover-color rounded-full p-2'
          />
        </button>
      </Tippy>
    </div>
  )
}
