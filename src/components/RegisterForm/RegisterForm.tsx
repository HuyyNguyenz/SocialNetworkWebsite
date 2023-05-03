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
    dateCreated: ''
  }
  const [formData, setFormData] = useState<User>(initialData)
  const [messages, handleValidation, disableValidation] = useFormValidation(formData)
  const [isMobileTablet, setMobileTablet] = useState<boolean>(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const dateCreated = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`

    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value, dateCreated }))
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
          toast(result.data.message, {
            position: 'top-center',
            type: 'success',
            autoClose: 2000
          })
          setFormData(initialData)
        } catch (error: any) {
          if (error.response) {
            const message: string = error.response.data.message
            toast(message, { position: 'top-center', type: 'error', autoClose: 2000 })
          } else {
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
      submitBtn?.classList.add('cursor-not-allowed', 'opacity-50')
      submitBtn?.classList.remove('cursor-pointer', 'hover:animation-btn')
    } else {
      submitBtn?.classList.remove('cursor-not-allowed', 'opacity-50')
      submitBtn?.classList.add('cursor-pointer', 'hover:animation-btn')
    }
  }, [formData, messages])

  useEffect(() => {
    const handleResize = () => {
      if (document.body.clientWidth < 1024) {
        setMobileTablet(true)
      } else {
        setMobileTablet(false)
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className='p-8 w-[22.5rem] max-h-[32.5rem] overflow-y-scroll md:w-[32.5rem] lg:w-full lg:h-full lg:overflow-y-hidden'>
      <h1 className='text-title-color text-24 font-bold text-center mb-8'>Đăng ký tài khoản</h1>
      <form className='text-14 text-center' onSubmit={handleSubmit} autoComplete='off'>
        <div className='mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-start'>
          <>
            <Tippy
              content={isMobileTablet ? '' : messages.firstName}
              disabled={messages.firstName && !isMobileTablet ? false : true}
            >
              <input
                onFocus={disableValidation}
                onBlur={handleValidation}
                onChange={handleChange}
                className={`bg-input-color border border-solid outline-none rounded-md py-2 px-4 mb-4 lg:mr-4 lg:mb-0 ${
                  messages.firstName ? 'border-red-600 text-red-600' : 'border-border-input-color'
                }`}
                type='text'
                name='firstName'
                id='firstName'
                placeholder='Họ lót'
                value={formData.firstName}
              />
            </Tippy>
            <span className='lg:hidden text-red-600 text-left mt-[-1rem] mb-4'>{messages.firstName}</span>
          </>

          <>
            <Tippy
              content={isMobileTablet ? '' : messages.lastName}
              disabled={messages.lastName && !isMobileTablet ? false : true}
            >
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
            <span className='lg:hidden text-red-600 text-left'>{messages.lastName}</span>
          </>
        </div>
        <div className='mb-4 flex flex-col'>
          <Tippy
            content={isMobileTablet ? '' : messages.email}
            disabled={messages.email && !isMobileTablet ? false : true}
            placement='left'
          >
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
          <span className='lg:hidden text-red-600 text-left'>{messages.email}</span>
        </div>
        <div className='mb-4 flex flex-col'>
          <Tippy
            content={isMobileTablet ? '' : messages.password}
            disabled={messages.password && !isMobileTablet ? false : true}
            placement='left'
          >
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
          <span className='lg:hidden text-red-600 text-left'>{messages.password}</span>
        </div>
        <div className='mb-4 flex flex-col items-start justify-start text-left'>
          <label htmlFor='birthDay' className={`mb-2 ${messages.birthDay ? 'text-red-600' : 'text-black'}`}>
            Ngày sinh
          </label>
          <Tippy
            content={isMobileTablet ? '' : messages.birthDay}
            disabled={messages.birthDay && !isMobileTablet ? false : true}
            placement='left'
          >
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
          <span className='lg:hidden text-red-600 text-left'>{messages.birthDay}</span>
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
          className='w-full mt-4 rounded-md bg-gradient-to-br from-primary-color to-secondary-color text-white font-bold py-2 px-16 lg:w-auto'
        />
      </form>
    </div>
  )
}
