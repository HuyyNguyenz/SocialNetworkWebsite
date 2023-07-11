import { faC, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import userImg from '~/assets/images/user.png'
import backGroundDefault from '~/assets/images/background_default.jpg'
import { useEffect, useState } from 'react'
import { FilePreview, User } from '~/types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import { toast } from 'react-toastify'
import { deleteFile, uploadFile } from '~/utils/firebase'
import fetchApi from '~/utils/fetchApi'
import { setUserData } from '~/features/userData/userDataSlice'
import Skeleton from 'react-loading-skeleton'

interface Props {
  isOpen: (value: boolean) => void
}

export default function EditProfile(props: Props) {
  const initialValue: Omit<FilePreview, 'id'> = { name: '', src: '', origin: undefined }
  const [avatar, setAvatar] = useState<Omit<FilePreview, 'id'>>(initialValue)
  const [coverImage, setCoverImage] = useState<Omit<FilePreview, 'id'>>(initialValue)
  const [isLoading, setLoading] = useState<boolean>(false)
  const userData = useSelector((state: RootState) => state.userData)
  const avatarImage = { name: '', url: '' }
  const backgroundImage = { name: '', url: '' }
  const dispatch = useDispatch()

  const handleCloseEditProfile = () => {
    document.body.classList.remove('overflow-y-hidden')
    props.isOpen(false)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0)
    if (file && file.type.includes('image')) {
      const src = URL.createObjectURL(file)
      event.target.name === 'avatar'
        ? setAvatar({ name: file.name, src, origin: file })
        : setCoverImage({ name: file.name, src, origin: file })
    } else {
      toast('Vui lòng chọn file ảnh', { type: 'info', autoClose: 2000, position: 'bottom-center' })
    }
  }

  const handleClearPreValue = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element = event.target as HTMLInputElement
    element.value = ''
  }

  const handleUploadFile = async () => {
    setLoading(true)
    if (avatar.name) {
      const { url, pathName } = await uploadFile(avatar.origin as File, 'avatar_images')
      avatarImage.url = url
      avatarImage.name = pathName
    }
    if (coverImage.name) {
      const { url, pathName } = await uploadFile(coverImage.origin as File, 'cover_images')
      backgroundImage.url = url
      backgroundImage.name = pathName
    }
  }

  const handleGetUser = async () => {
    const result = (await fetchApi.get(`user/${userData.username}`)).data
    dispatch(setUserData(result))
  }

  const handleClick = async () => {
    if (avatar.name || coverImage.name) {
      await handleUploadFile()
      if (avatarImage.name && userData.avatar?.name) {
        await deleteFile(userData.avatar.name)
      }
      if (backgroundImage.name && userData.backgroundImage?.name) {
        await deleteFile(userData.backgroundImage.name)
      }
      const data: User = {
        ...userData,
        avatar: avatarImage.name !== '' ? avatarImage : userData.avatar,
        backgroundImage: backgroundImage.name !== '' ? backgroundImage : userData.backgroundImage
      }
      const result = (await fetchApi.put(`user/${userData.id}`, data)).data
      toast(result.message, { type: 'success', autoClose: 2000, position: 'top-right' })
      setAvatar(initialValue)
      setCoverImage(initialValue)
      avatarImage.name = ''
      avatarImage.url = ''
      backgroundImage.name = ''
      backgroundImage.url = ''
      handleGetUser()
      setLoading(false)
    }
  }

  useEffect(() => {
    const btnSubmit = document.getElementById('submitBtn')
    if (avatar.name || coverImage.name) {
      btnSubmit?.classList.remove('cursor-not-allowed', 'opacity-50')
      btnSubmit?.classList.add('hover:opacity-90')
    } else {
      btnSubmit?.classList.remove('hover:opacity-90')
      btnSubmit?.classList.add('cursor-not-allowed', 'opacity-50')
    }
  }, [avatar.name, coverImage.name])

  useEffect(() => {
    if (avatar?.name) {
      return () => URL.revokeObjectURL(avatar.src)
    }
  }, [avatar])

  useEffect(() => {
    if (coverImage?.name) {
      return () => URL.revokeObjectURL(coverImage.src)
    }
  }, [coverImage])

  return (
    <>
      <div className='text-center fixed center w-[48rem] h-[90%] bg-bg-light dark:bg-bg-dark border border-solid border-border-color dark:border-dark-border-color z-[60] rounded-md py-2 text-20 text-text-color dark:text-dark-text-color overflow-hidden'>
        <div className='flex item-center justify-between text-title-color dark:text-dark-title-color border-b border-solid border-border-color dark:border-dark-border-color py-4 px-6'>
          <h2 className='font-bold'>Chỉnh sửa trang cá nhân</h2>
          <button onClick={handleCloseEditProfile} className='hover:opacity-80'>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-bold'>Ảnh đại diện</h3>
            <div className='flex items-center justify-start'>
              <label
                htmlFor='avatar'
                className='text-16 hover:text-primary-color dark:hover:text-dark-primary-color hover:font-bold cursor-pointer transition-all ease-linear duration-150'
              >
                Chỉnh sửa
              </label>
              <input
                onChange={handleFileChange}
                onClick={handleClearPreValue}
                type='file'
                name='avatar'
                id='avatar'
                className='hidden'
              />
            </div>
          </div>
          {avatar?.src ? (
            isLoading ? (
              <Skeleton className='w-28 h-28 object-cover rounded-md my-0 mx-auto dark:bg-bg-dark' />
            ) : (
              <img
                className='w-28 h-28 object-cover rounded-md my-0 mx-auto'
                loading='lazy'
                src={avatar.src}
                alt={userData.firstName + ' ' + userData.lastName}
              />
            )
          ) : (
            <img
              className='w-28 h-28 object-cover rounded-md my-0 mx-auto'
              loading='lazy'
              src={userData.avatar ? userData.avatar.url : userImg}
              alt={userData.firstName + ' ' + userData.lastName}
            />
          )}
        </div>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-bold'>Ảnh bìa</h3>
            <div className='flex items-center justify-start'>
              <label
                htmlFor='coverImage'
                className='text-16 hover:text-primary-color dark:hover:text-dark-primary-color hover:font-bold cursor-pointer transition-all ease-linear duration-150'
              >
                Chỉnh sửa
              </label>
              <input
                onChange={handleFileChange}
                onClick={handleClearPreValue}
                type='file'
                name='coverImage'
                id='coverImage'
                className='hidden'
              />
            </div>
          </div>
          {coverImage?.src ? (
            isLoading ? (
              <Skeleton className='w-[70%] h-[14rem] object-cover rounded-md my-0 mx-auto dark:bg-bg-dark' />
            ) : (
              <img
                className='w-[70%] h-[14rem] object-cover rounded-md my-0 mx-auto'
                loading='lazy'
                src={coverImage.src}
                alt={userData.firstName + ' ' + userData.lastName}
              />
            )
          ) : (
            <img
              className='w-[70%] h-[14rem] object-cover rounded-md my-0 mx-auto'
              loading='lazy'
              src={userData.backgroundImage ? userData.backgroundImage.url : backGroundDefault}
              alt={userData.firstName + ' ' + userData.lastName}
            />
          )}
        </div>
        {isLoading ? (
          <button
            disabled
            className='mt-4 bg-gradient-to-r from-primary-color dark:from-dark-primary-color to-secondary-color dark:to-secondary-color rounded-md text-white font-semibold w-[30%] py-1 text-16 cursor-not-allowed opacity-50'
          >
            <FontAwesomeIcon className='animate-spin mr-2' icon={faC} />
            <span>Đang xử lý</span>
          </button>
        ) : (
          <button
            id='submitBtn'
            onClick={handleClick}
            className='mt-4 bg-gradient-to-r from-primary-color dark:from-dark-primary-color to-secondary-color dark:to-secondary-color rounded-md text-white font-semibold w-[30%] py-1 text-16'
          >
            Cập nhật
          </button>
        )}
      </div>
      <button className='cursor-default' onClick={handleCloseEditProfile}>
        <div className='overlay' />
      </button>
    </>
  )
}
