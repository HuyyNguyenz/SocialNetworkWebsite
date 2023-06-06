import { useState } from 'react'
import Tippy from '@tippyjs/react/headless'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { Comment, FilePreview } from '~/types'
import { confirmAlert } from 'react-confirm-alert'
import { useDispatch } from 'react-redux'
import { deleteComment, startEditingComment } from '~/features/comment/commentSlice'
import fetchApi from '~/utils/fetchApi'
import { toast } from 'react-toastify'
import { deleteFile } from '~/utils/firebase'

interface Props {
  comment: Comment
}

export default function SettingComment(props: Props) {
  const { comment } = props
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
            dispatch(deleteComment(commentDeleted))
            const result = (await fetchApi.delete(`comment/${comment.id}`)).data
            toast(result.message, { autoClose: 2000, type: 'success', position: 'top-right' })
            if ((comment.images?.length as number) > 0) {
              for await (const image of comment.images as FilePreview[]) {
                await deleteFile(image.name)
              }
            }
            if (comment.video?.name) {
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

  const handleEditingComment = () => {
    dispatch(startEditingComment(comment))
    setOpenSetting(false)
  }

  return (
    <div>
      <Tippy
        zIndex={10}
        placement='right-start'
        onClickOutside={() => setOpenSetting(false)}
        visible={isOpenSetting}
        interactive
        render={(attrs) => (
          <div
            className='flex flex-col items-start justify-start bg-white border border-solid border-border-color shadow-md rounded-md py-2 text-14 text-text-color'
            tabIndex={-1}
            {...attrs}
          >
            <button onClick={handleEditingComment} className='w-full px-4 py-2 hover:bg-hover-color'>
              Chỉnh sửa
            </button>
            <button onClick={handleDeleteComment} className='w-full px-4 py-2 hover:bg-hover-color'>
              Xoá
            </button>
          </div>
        )}
      >
        <button onClick={() => setOpenSetting(!isOpenSetting)} className='flex items-center justify-start'>
          <FontAwesomeIcon icon={faEllipsis} className='hover:bg-hover-color rounded-full p-2' />
        </button>
      </Tippy>
    </div>
  )
}
