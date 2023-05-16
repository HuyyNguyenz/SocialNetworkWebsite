import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useCookie from '~/hooks/useCookie'
import fetchApi from '~/utils/fetchApi'
import ForgotForm from '../ForgotForm'

export default function LoginForm() {
  const [formData, setFormData] = useState<{ accountName: string; password: string; remember: boolean }>({
    accountName: '',
    password: '',
    remember: false
  })
  const [isOpenForgotForm, setOpenForgotForm] = useState<boolean>(false)
  const [setCookie] = useCookie()
  const navigate = useNavigate()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value, remember: event.target.checked }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (formData.accountName === '') {
      toast('Mời bạn nhập email hoặc username', { position: 'top-right', type: 'warning', autoClose: 2000 })
    } else if (formData.password === '') {
      toast('Mời bạn nhập mật khẩu', { position: 'top-right', type: 'warning', autoClose: 2000 })
    } else {
      const handleLogin = async () => {
        const { remember, ...data } = formData
        try {
          const result = (await fetchApi.post('login', data)).data
          const expireDay = remember ? 7 : 0
          localStorage.setItem('remember', remember + '')
          setCookie('accessToken', result.accessToken, expireDay)
          setCookie('refreshToken', result.refreshToken, expireDay)
          toast(result.message, { position: 'top-right', type: 'success', autoClose: 1000 })
          setTimeout(() => {
            navigate('/')
          }, 2000)
        } catch (error: any) {
          if (error.response) {
            toast(error.response.data.message, { position: 'top-right', type: 'error', autoClose: 2000 })
          } else {
            toast(error.code, { position: 'top-right', type: 'error', autoClose: 2000 })
          }
        }
      }
      handleLogin()
    }
  }

  const handleOpenForgotForm = () => {
    setOpenForgotForm(true)
  }

  const handleCloseForgotForm = (value: boolean) => {
    setOpenForgotForm(value)
  }

  return (
    <div className='p-8 w-[22.5rem] md:w-full'>
      {isOpenForgotForm ? (
        <ForgotForm isCloseForgotForm={handleCloseForgotForm} />
      ) : (
        <>
          <h1 className='text-title-color text-24 font-bold text-center mb-8'>Đăng nhập</h1>
          <form
            className='text-14 text-center'
            autoComplete='off'
            onSubmit={handleSubmit}
            onReset={handleOpenForgotForm}
          >
            <div className='mb-4'>
              <input
                onChange={handleChange}
                value={formData.accountName}
                className='min-w-[18.75rem] md:min-w-[25rem] bg-input-color border border-solid outline-none rounded-md py-2 px-4 border-border-input-color'
                type='text'
                name='accountName'
                id='accountName'
                placeholder='Email hoặc Username'
              />
            </div>
            <div className='mb-4'>
              <input
                onChange={handleChange}
                value={formData.password}
                className='min-w-[18.75rem] md:min-w-[25rem] bg-input-color border border-solid outline-none rounded-md py-2 px-4 border-border-input-color'
                type='password'
                name='password'
                id='password'
                placeholder='Mật khẩu'
                minLength={8}
                maxLength={32}
              />
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center justify-start'>
                <input
                  onChange={handleChange}
                  checked={formData.remember}
                  type='checkbox'
                  name='remember'
                  id='remember'
                />
                <label className='ml-1 select-none' htmlFor='remember'>
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <button type='reset'>Quên mật khẩu ?</button>
            </div>
            <input
              type='submit'
              value='Đăng nhập'
              id='submitBtn'
              className='w-full lg:w-auto mt-4 rounded-md bg-gradient-to-br from-primary-color to-secondary-color text-white font-bold py-2 px-16 cursor-pointer hover:animation-btn'
            />
          </form>
        </>
      )}
    </div>
  )
}
