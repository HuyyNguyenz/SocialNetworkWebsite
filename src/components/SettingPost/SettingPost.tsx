import { useState } from 'react'
import Tippy from '@tippyjs/react/headless'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faEllipsis, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { confirmAlert } from 'react-confirm-alert'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import { deletePost, startEditing } from '~/features/post/postSlice'
import fetchApi from '~/utils/fetchApi'
import { toast } from 'react-toastify'
import { FilePreview, Post } from '~/types'
import { deleteFile } from '~/utils/firebase'

interface Props {
  post: Post
}

export default function SettingPost(props: Props) {
  const { post } = props
  const userData = useSelector((state: RootState) => state.userData)
  const [isOpenSetting, setOpenSetting] = useState<boolean>(false)
  const dispatch = useDispatch()

  const handleDeletePost = () => {
    confirmAlert({
      title: 'Xác nhận để xoá bài viết',
      message: 'Bạn có chắc là muốn xoá bài viết ?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: async () => {
            const postDeleted = { ...post }
            postDeleted.deleted = 1
            dispatch(deletePost(postDeleted))
            const result = (await fetchApi.delete(`post/${post.id}`)).data
            toast(result.message, { autoClose: 2000, type: 'success', position: 'top-right' })
            if ((post.images?.length as number) > 0) {
              for await (const image of post.images as FilePreview[]) {
                await deleteFile(image.name)
              }
            }
            if (post.video?.name) {
              await deleteFile(post.video.name)
            }
          }
        },
        {
          label: 'Huỷ'
        }
      ]
    })
  }

  const handleEditingPost = () => {
    dispatch(startEditing(post))
    setOpenSetting(false)
  }

  return (
    <div>
      <Tippy
        onClickOutside={() => setOpenSetting(false)}
        visible={isOpenSetting}
        interactive
        placement='bottom-end'
        zIndex={10}
        render={(attrs) => (
          <div
            className='bg-white rounded-md border border-solid border-border-color text-14 py-4 shadow-md animate-fade'
            tabIndex={-1}
            {...attrs}
          >
            <button
              className={`w-full flex items-center justify-start px-4 py-2 hover:bg-hover-color ${
                userData.id === post.userId ? 'mb-2' : ''
              }`}
            >
              <FontAwesomeIcon icon={faBookmark} />
              <span className='ml-2'>Lưu bài viết</span>
            </button>
            {userData.id === post?.userId && (
              <>
                <button
                  onClick={handleEditingPost}
                  className='w-full flex items-center justify-start px-4 py-2 mb-2 hover:bg-hover-color'
                >
                  <FontAwesomeIcon icon={faPencil} />
                  <span className='ml-2'>Chỉnh sửa bài viết</span>
                </button>
                <button
                  onClick={handleDeletePost}
                  className='w-full flex items-center justify-start px-4 py-2 hover:bg-hover-color'
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span className='ml-2'>Xoá bài viết</span>
                </button>
              </>
            )}
          </div>
        )}
      >
        <button onClick={() => setOpenSetting(!isOpenSetting)}>
          <FontAwesomeIcon
            icon={faEllipsis}
            className='text-20 text-title-color rounded-full p-2 hover:bg-hover-color'
          />
        </button>
      </Tippy>
    </div>
  )
}
