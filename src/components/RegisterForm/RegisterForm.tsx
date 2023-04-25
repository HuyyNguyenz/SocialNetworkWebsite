import { useEffect, useState } from 'react'
import { User } from '~/types'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import useFormValidation from '~/hooks/useFormValidation'
import fetchApi from '~/utils/fetchApi'
import { toast } from 'react-toastify'

export default function RegisterForm() {
  const initialData = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDay: '',
    gender: 'male',
    dateCreated: '',
    roleId: ''
  }
  const [formData, setFormData] = useState<User>(initialData)
  const [messages, handleValidation, disableValidation] = useFormValidation(formData)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const dateCreated = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`

    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value, roleId: '2', dateCreated }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isFormNull =
      formData.email === '' ||
      formData.password === '' ||
      formData.firstName === '' ||
      formData.lastName === '' ||
      formData.birthDay === ''
    const isFormError =
      messages.email !== '' ||
      messages.password !== '' ||
      messages.firstName !== '' ||
      messages.lastName !== '' ||
      messages.birthDay !== ''
    if (!(isFormNull || isFormError)) {
      const stringArray = formData.birthDay.split('-')
      const birthDay = `${stringArray[2]}/${stringArray[1]}/${stringArray[0]}`
      const data = { ...formData, birthDay }
      const createAccount = async () => {
        try {
          const result = await fetchApi.post('register', data)
          if (result.data.message) {
            toast(result.data.message, {
              position: 'top-center',
              type: 'success',
              autoClose: 2000
            })
            setFormData(initialData)
          } else {
            toast(result.data.error.message, { position: 'top-center', type: 'warning', autoClose: 2000 })
          }
        } catch (error: any) {
          if (error) {
            toast(error.message, { position: 'top-center', type: 'error', autoClose: 2000 })
          }
        }
      }
      createAccount()
    }
  }

  useEffect(() => {
    const submitBtn = document.getElementById('submitBtn')
    const isFormNull =
      formData.email === '' ||
      formData.password === '' ||
      formData.firstName === '' ||
      formData.lastName === '' ||
      formData.birthDay === ''
    const isFormError =
      messages.email !== '' ||
      messages.password !== '' ||
      messages.firstName !== '' ||
      messages.lastName !== '' ||
      messages.birthDay !== ''

    if (isFormNull || isFormError) {
      submitBtn?.classList.add('cursor-not-allowed')
      submitBtn?.classList.add('opacity-50')
      submitBtn?.classList.remove('cursor-pointer')
      submitBtn?.classList.remove('hover:animation-btn')
    } else {
      submitBtn?.classList.remove('cursor-not-allowed')
      submitBtn?.classList.remove('opacity-50')
      submitBtn?.classList.add('cursor-pointer')
      submitBtn?.classList.add('hover:animation-btn')
    }
  }, [formData, messages])

  return (
    <div className='p-8'>
      <h1 className='text-title-color text-24 font-bold text-center mb-8'>Đăng ký tài khoản</h1>
      <form className='text-14 text-center' onSubmit={handleSubmit} autoComplete='off'>
        <div className='mb-4 flex items-center justify-start'>
          <Tippy content={messages.firstName} disabled={messages.firstName ? false : true}>
            <input
              onFocus={disableValidation}
              onBlur={handleValidation}
              onChange={handleChange}
              className={`bg-input-color border border-solid outline-none rounded-md py-2 px-4 mr-4 ${
                messages.firstName ? 'border-red-600 text-red-600' : 'border-border-input-color'
              }`}
              type='text'
              name='firstName'
              id='firstName'
              placeholder='Họ lót'
              value={formData.firstName}
            />
          </Tippy>

          <Tippy content={messages.lastName} disabled={messages.lastName ? false : true}>
            <input
              onFocus={disableValidation}
              onBlur={handleValidation}
              onChange={handleChange}
              className={`bg-input-color border border-solid outline-none rounded-md py-2 px-4 ${
                messages.lastName ? 'border-red-600 text-red-600' : 'border-border-input-color'
              }`}
              type='text'
              name='lastName'
              id='lastName'
              placeholder='Tên'
              value={formData.lastName}
            />
          </Tippy>
        </div>
        <div className='mb-4'>
          <Tippy content={messages.email} disabled={messages.email ? false : true} placement='left'>
            <input
              onFocus={disableValidation}
              onBlur={handleValidation}
              onChange={handleChange}
              className={`w-full bg-input-color border border-solid outline-none rounded-md py-2 px-4 ${
                messages.email ? 'border-red-600 text-red-600' : 'border-border-input-color'
              }`}
              type='email'
              name='email'
              id='email'
              placeholder='Email'
              value={formData.email}
            />
          </Tippy>
        </div>
        <div className='mb-4'>
          <Tippy content={messages.password} disabled={messages.password ? false : true} placement='left'>
            <input
              onFocus={disableValidation}
              onBlur={handleValidation}
              onChange={handleChange}
              className={`w-full bg-input-color border border-solid outline-none rounded-md py-2 px-4 ${
                messages.password ? 'border-red-600 text-red-600' : 'border-border-input-color'
              }`}
              type='password'
              name='password'
              id='password'
              placeholder='Mật khẩu'
              maxLength={32}
              value={formData.password}
            />
          </Tippy>
        </div>
        <div className='mb-4 flex flex-col items-start justify-start text-left'>
          <label htmlFor='birthDay' className={`mb-2 ${messages.birthDay ? 'text-red-600' : 'text-black'}`}>
            Ngày sinh
          </label>
          <Tippy content={messages.birthDay} disabled={messages.birthDay ? false : true} placement='left'>
            <input
              onBlur={handleValidation}
              onFocus={disableValidation}
              onChange={handleChange}
              className={`w-full bg-input-color border border-solid outline-none rounded-md py-2 px-4 ${
                messages.birthDay ? 'border-red-600 text-red-600' : 'border-border-input-color'
              }`}
              type='date'
              name='birthDay'
              id='birthDay'
              min='1943-01-01'
              value={formData.birthDay}
            />
          </Tippy>
        </div>
        <div className='mb-4 text-left'>
          <label htmlFor='gender'>Giới tính</label>
          <div className='flex items-start justify-start mt-2'>
            <div className='flex items-center justify-start bg-input-color border border-solid border-border-input-color outline-none rounded-md py-2 px-4 mr-4'>
              <label htmlFor='male' className='mr-2'>
                Nam
              </label>
              <input onChange={handleChange} defaultChecked type='radio' name='gender' id='male' value='male' />
            </div>
            <div className='flex items-center justify-start bg-input-color border border-solid border-border-input-color outline-none rounded-md py-2 px-4'>
              <label htmlFor='female' className='mr-2'>
                Nữ
              </label>
              <input onChange={handleChange} type='radio' name='gender' id='female' value='female' />
            </div>
          </div>
        </div>
        <input
          type='submit'
          value='Đăng ký'
          id='submitBtn'
          className='mt-4 rounded-md bg-gradient-to-br from-primary-color to-secondary-color text-white font-bold py-2 px-16'
        />
      </form>
    </div>
  )
}
