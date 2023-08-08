import moment from 'moment'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { setUserData } from '~/features/userData/userDataSlice'
import UserSettingLayout from '~/layouts/UserSettingLayout'
import { RootState } from '~/store'
import { User } from '~/types'
import fetchApi from '~/utils/fetchApi'

export default function ProfileSetting() {
  const userData = useSelector((state: RootState) => state.userData)
  const [user, setUser] = useState<User>()
  const [isEditing, setEditing] = useState<boolean>(false)
  const errorFirstName = document.querySelector('.errorFirstName') as HTMLSpanElement
  const errorLastName = document.querySelector('.errorLastName') as HTMLSpanElement
  const errorBirthDay = document.querySelector('.errorBirthDay') as HTMLSpanElement
  const dispatch = useDispatch()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentYear = new Date().getFullYear()

    switch (event.target.name) {
      case 'firstName':
        event.target.value.trim() === ''
          ? (errorFirstName.innerText = 'Họ và tên lót không được để trống')
          : (errorFirstName.innerText = '')
        setUser((prev) => ({
          ...prev,
          firstName: prev?.firstName === '' ? event.target.value.trim() : event.target.value
        }))
        break
      case 'lastName':
        event.target.value.trim() === ''
          ? (errorLastName.innerText = 'Tên không được để trống')
          : (errorLastName.innerText = '')
        setUser((prev) => ({
          ...prev,
          lastName: prev?.lastName === '' ? event.target.value.trim() : event.target.value
        }))
        break
      case 'birthDay':
        currentYear - Number(event.target.value.split('-')[0]) < 16
          ? (errorBirthDay.innerText = 'Bạn chưa đủ tuổi < 16')
          : (errorBirthDay.innerText = '')
        setUser((prev) => ({
          ...prev,
          birthDay: moment(event.target.value, 'YYYY-MM-DD').format('DD/MM/YYYY')
        }))
        break
      case 'male':
        setUser((prev) => ({
          ...prev,
          gender: event.target.name
        }))
        break
      case 'female':
        setUser((prev) => ({
          ...prev,
          gender: event.target.name
        }))
        break
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (errorFirstName.innerText === '' && errorLastName.innerText === '' && errorBirthDay.innerText === '') {
      const result = (await fetchApi.put(`user/${userData.id}`, user as User)).data
      result.message && toast(result.message, { autoClose: 2000, position: 'top-right', type: 'success' })
      dispatch(setUserData(user as User))
      setEditing(false)
    }
  }

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    errorFirstName.innerText = ''
    errorLastName.innerText = ''
    errorBirthDay.innerText = ''
    setUser(userData)
    setEditing(false)
  }

  useEffect(() => {
    userData && setUser(userData)
  }, [userData])

  return (
    <UserSettingLayout>
      <div className='ml-8 text-14 text-text-color dark:text-dark-text-color w-full bg-bg-light dark:bg-bg-dark p-4 rounded-md border border-solid border-border-color dark:border-dark-border-color flex-1'>
        <form
          onSubmit={handleSubmit}
          onReset={handleReset}
          action='POST'
          className='flex flex-col items-start justify-start w-full'
        >
          <div className='flex flex-col items-start justify-start mb-4 w-full'>
            <label htmlFor='firstName' className='font-semibold'>
              Họ và tên lót:
            </label>
            <input
              onChange={handleChange}
              spellCheck={false}
              type='text'
              name='firstName'
              id='firstName'
              value={user ? user.firstName : ''}
              disabled={isEditing ? false : true}
              className='bg-hover-color border border-solid border-dark-border-color outline-none rounded-md py-2 px-4 w-full text-text-color font-medium mt-2'
            />
            <span className='errorFirstName text-red-600'></span>
          </div>
          <div className='flex flex-col items-start justify-start mb-4 w-full'>
            <label htmlFor='lastName' className='font-semibold'>
              Tên:
            </label>
            <input
              onChange={handleChange}
              spellCheck={false}
              type='text'
              name='lastName'
              id='lastName'
              value={user ? user.lastName : ''}
              disabled={isEditing ? false : true}
              className='bg-hover-color border border-solid border-dark-border-color outline-none rounded-md py-2 px-4 w-full text-text-color font-medium mt-2'
            />
            <span className='errorLastName text-red-600'></span>
          </div>
          <div className='flex flex-col items-start justify-start mb-4 w-full'>
            <label htmlFor='birthDay' className='font-semibold'>
              Ngày sinh:
            </label>
            <input
              onChange={handleChange}
              type='date'
              name='birthDay'
              id='birthDay'
              value={user ? moment(user.birthDay, 'DD/MM/YYYY').format('YYYY-MM-DD') : ''}
              disabled={isEditing ? false : true}
              className='bg-hover-color border border-solid border-dark-border-color outline-none rounded-md py-2 px-4 w-full text-text-color font-medium mt-2'
            />
            <span className='errorBirthDay text-red-600'></span>
          </div>
          <div className='flex flex-col items-start justify-start mb-4 w-full'>
            <span className='font-semibold'>Giới tính:</span>
            <div className='flex items-center justify-start mt-2'>
              <div className='flex items-center justify-start mr-4'>
                <input
                  onChange={handleChange}
                  disabled={isEditing ? false : true}
                  checked={user ? (user.gender === 'male' ? true : false) : false}
                  type='radio'
                  name='male'
                  id='male'
                />
                <label htmlFor='male' className='ml-2'>
                  Nam
                </label>
              </div>
              <div className='flex items-center justify-start mr-4'>
                <input
                  onChange={handleChange}
                  disabled={isEditing ? false : true}
                  checked={user ? (user.gender === 'female' ? true : false) : false}
                  type='radio'
                  name='female'
                  id='female'
                />
                <label htmlFor='female' className='ml-2'>
                  Nữ
                </label>
              </div>
            </div>
          </div>
          <div className='mb-4 self-end'>
            <span>
              Ngày tạo tài khoản: <strong>{userData.createdAt}</strong>
            </span>
          </div>
          <div className='self-center flex items-center justify-start'>
            {isEditing ? (
              <button
                type='submit'
                className='bg-gradient-to-r from-primary-color to-secondary-color dark:from-dark-primary-color dark:to-secondary-color rounded-md px-4 py-2 text-white font-bold hover:opacity-90 mr-4'
              >
                <span>Cập nhật</span>
              </button>
            ) : (
              <button
                type='button'
                onClick={(event) => {
                  event.preventDefault()
                  setEditing(true)
                }}
                className='bg-gradient-to-r from-primary-color to-secondary-color dark:from-dark-primary-color dark:to-secondary-color rounded-md px-4 py-2 text-white font-bold hover:opacity-90 mr-4'
              >
                <span>Chỉnh sửa</span>
              </button>
            )}
            {isEditing && (
              <button type='reset' className='text-title-color dark:text-dark-title-color font-bold'>
                <span>Huỷ</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </UserSettingLayout>
  )
}
