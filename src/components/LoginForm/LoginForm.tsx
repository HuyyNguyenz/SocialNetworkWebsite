import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useCookie from '~/hooks/useCookie'
import fetchApi from '~/utils/fetchApi'

export default function LoginForm() {
  const [formData, setFormData] = useState<{ accountName: string; password: string; remember: boolean }>({
    accountName: '',
    password: '',
    remember: false
  })
  const { setCookie, getCookie } = useCookie()
  const navigate = useNavigate()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value, remember: event.target.checked }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const accountNameInput = document.getElementById('accountName')
    const passwordInput = document.getElementById('password')

    if (formData.accountName === '') {
      toast('Mời bạn nhập email hoặc username', { position: 'top-right', type: 'warning', autoClose: 2000 })
    } else if (formData.password === '') {
      toast('Mời bạn nhập mật khẩu', { position: 'top-right', type: 'warning', autoClose: 2000 })
    } else {
      const handleLogin = () => {
        const { remember, ...data } = formData
        fetchApi
          .post('login', data)
          .then((res) => {
            if (accountNameInput?.classList.contains('border-red-600')) {
              accountNameInput?.classList.remove('border-red-600', 'text-red-600')
              accountNameInput?.classList.add('border-border-input-color')
            }
            if (passwordInput?.classList.contains('border-red-600')) {
              passwordInput?.classList.remove('border-red-600', 'text-red-600')
              passwordInput?.classList.add('border-border-input-color')
            }
            const expireDay = remember ? 7 : 0
            setCookie('refreshToken', res.data.refreshToken, expireDay)
            localStorage.setItem('accessToken', res.data.accessToken)
            localStorage.setItem('remember', formData.remember + '')
            navigate('/')
          })
          .catch((error) => {
            if (error.response) {
              const message: string = error.response.data.message
              const errorType: string = error.response.data.errorType
              toast(message, { position: 'top-right', type: 'error', autoClose: 2000 })
              if (errorType === 'accountName') {
                accountNameInput?.classList.remove('border-border-input-color')
                accountNameInput?.classList.add('border-red-600', 'text-red-600')
              } else {
                passwordInput?.classList.remove('border-border-input-color')
                passwordInput?.classList.add('border-red-600', 'text-red-600')
              }
            } else {
              toast(error.message, { position: 'top-right', type: 'error', autoClose: 2000 })
            }
          })
      }
      handleLogin()
    }
  }

  const handleGetUsers = () => {
    const accessToken = localStorage.getItem('accessToken')
    const getUser = async () => {
      try {
        const result = (await fetchApi.get('users', { headers: { token: `Bearer ${accessToken}` } })).data
        console.log(result)
      } catch (error: any) {
        if (error.response.data === 'Token is expired') {
          handleRefreshToken()
        }
      }
    }
    getUser()
  }

  const handleRefreshToken = async () => {
    try {
      const refreshToken = getCookie('refreshToken')
      const result = (await fetchApi.post('refresh', { refreshToken })).data
      const remember = localStorage.getItem('remember')
      localStorage.setItem('accessToken', result.accessToken)
      setCookie('refreshToken', result.refreshToken, remember ? 7 : 0)
      handleGetUsers()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='p-8'>
      <h1 className='text-title-color text-24 font-bold text-center mb-8'>Đăng nhập</h1>
      <form className='text-14 text-center' autoComplete='off' onSubmit={handleSubmit}>
        <div className='mb-4'>
          <input
            onChange={handleChange}
            value={formData.accountName}
            className='min-w-[25rem] bg-input-color border border-solid outline-none rounded-md py-2 px-4 border-border-input-color'
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
            className='min-w-[25rem] bg-input-color border border-solid outline-none rounded-md py-2 px-4 border-border-input-color'
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
            <input onChange={handleChange} checked={formData.remember} type='checkbox' name='remember' id='remember' />
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
          className='mt-4 rounded-md bg-gradient-to-br from-primary-color to-secondary-color text-white font-bold py-2 px-16 cursor-pointer hover:animation-btn'
        />
        {/* <button onClick={handleGetUsers} type='button'>
          Get users
        </button> */}
      </form>
    </div>
  )
}
