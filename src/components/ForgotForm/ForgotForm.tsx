import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import fetchApi from '~/utils/fetchApi'

interface Props {
  isCloseForgotForm: (value: boolean) => void
}

export default function ForgotPassword(props: Props) {
  const [email, setEmail] = useState<string>('')
  const [otpValue, setOtpValue] = useState<string>('')
  const [counter, setCounter] = useState<number>(60)
  const navigate = useNavigate()

  const handleCloseForgotForm = () => {
    props.isCloseForgotForm(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'email') {
      setEmail(event.target.value)
    } else {
      setOtpValue(event.target.value)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const result = (await fetchApi.post('verifyOtp', { otpCode: otpValue, userEmail: email })).data
      const userOtp = JSON.stringify(result.userOtp)
      sessionStorage.setItem('recovery', userOtp)
      navigate('/recovery')
    } catch (error: any) {
      if (error.response) {
        toast(error.response.data.message, { type: 'error', autoClose: 2000, position: 'top-right' })
      } else {
        toast(error.code, { type: 'error', autoClose: 2000, position: 'top-right' })
      }
    }
  }

  const handleRequestResetPassword = async () => {
    if (email === '') {
      toast('Vui lòng nhập email', { autoClose: 2000, position: 'top-right', type: 'warning' })
    } else if (!(email.includes('@') && email.includes('.'))) {
      toast('Email chưa đúng định dạng', { autoClose: 2000, position: 'top-right', type: 'warning' })
    } else {
      try {
        setCounter((prev) => prev - 1)
        const interval = setInterval(() => {
          setCounter((prev) => prev - 1)
        }, 1000)
        setTimeout(() => {
          clearInterval(interval)
          setCounter(60)
        }, 60000)
        const result = (await fetchApi.post('verifyEmail', { email })).data
        toast(result.message, { autoClose: 2000, position: 'top-right', type: 'success' })
      } catch (error: any) {
        toast(error.response.data.message, { autoClose: 2000, position: 'top-right', type: 'error' })
      }
    }
  }

  return (
    <>
      <div className='flex items-center justify-start text-title-color text-24 font-bold mb-4'>
        <button onClick={handleCloseForgotForm}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <h1 className='ml-4'>Quên mật khẩu</h1>
      </div>
      <form className='text-14 text-center' onSubmit={handleSubmit}>
        <input
          required
          onChange={handleChange}
          value={email}
          type='email'
          name='email'
          id='email'
          placeholder='Nhập email'
          className='min-w-[18.75rem] md:min-w-[25rem] bg-input-color border border-solid outline-none rounded-md py-2 px-4 mb-4 border-border-color '
        />
        <div className='flex items-center justify-start min-w-[18.75rem] md:min-w-[25rem]'>
          <input
            maxLength={6}
            onChange={handleChange}
            value={otpValue.toLowerCase()}
            required
            type='text'
            name='otpCode'
            id='otpCode'
            placeholder='Nhập mã xác nhận'
            className='w-[70%] bg-input-color border border-solid outline-none rounded-md py-2 px-4 border-border-color'
          />
          {counter < 60 ? (
            <button type='button' className='w-[30%] px-4 py-2 bg-secondary-color text-white rounded-md ml-4'>
              {counter}
            </button>
          ) : (
            <button
              onClick={handleRequestResetPassword}
              type='button'
              id='sendCode'
              className='w-[30%] px-4 py-2 bg-primary-color text-white rounded-md ml-4'
            >
              Nhận mã
            </button>
          )}
        </div>
        <input
          type='submit'
          value='Gửi yêu cầu'
          id='submitBtn'
          className='w-full lg:w-auto mt-4 rounded-md bg-gradient-to-br from-primary-color to-secondary-color text-white font-bold py-2 px-16 cursor-pointer hover:animation-btn'
        />
      </form>
    </>
  )
}
