import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useFormValidation from '~/hooks/useFormValidation'
import { User } from '~/types'
import fetchApi from '~/utils/fetchApi'

export default function RecoveryForm() {
  const [recoveryValue, setRecoveryValue] = useState<{ password: string; rePassword: string }>({
    password: '',
    rePassword: ''
  })
  const formData: User = {
    password: recoveryValue.password,
    rePassword: recoveryValue.rePassword
  }
  const [messages, handleValidation, disableValidation, checkFormError] = useFormValidation(formData)
  const navigate = useNavigate()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecoveryValue((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isFormError = checkFormError()
    if (!isFormError) {
      const { password } = formData
      const { userEmail } = JSON.parse(sessionStorage.getItem('recovery') as string)
      try {
        const result = (await fetchApi.put(`recovery-password/${userEmail}`, { password })).data
        toast(result.message, { type: 'success', autoClose: 2000, position: 'top-right' })
        setTimeout(() => {
          sessionStorage.removeItem('recovery')
          setRecoveryValue({
            password: '',
            rePassword: ''
          })
          navigate('/login')
        }, 2500)
      } catch (error: any) {
        toast(error.code, { type: 'error', autoClose: 2000, position: 'top-right' })
      }
    }
  }

  useEffect(() => {
    const submitBtn = document.getElementById('submitBtn')
    const isFormError = checkFormError()
    if (isFormError) {
      submitBtn?.classList.add('cursor-not-allowed', 'opacity-50')
      submitBtn?.classList.remove('cursor-pointer', 'hover:animation-btn')
    } else {
      submitBtn?.classList.remove('cursor-not-allowed', 'opacity-50')
      submitBtn?.classList.add('cursor-pointer', 'hover:animation-btn')
    }
  }, [checkFormError])

  return (
    <div className='p-8 w-[22.5rem] md:w-full'>
      <h1 className='text-title-color text-24 text-center font-bold mb-4'>Khôi phục mật khẩu</h1>
      <form className='text-14 text-center' onSubmit={handleSubmit}>
        <div className='mb-4 flex flex-col'>
          <input
            onBlur={handleValidation}
            onFocus={disableValidation}
            onChange={handleChange}
            type='password'
            name='password'
            id='password'
            placeholder='Nhập mật khẩu mới'
            className={`min-w-[18.75rem] md:min-w-[25rem] bg-input-color border border-solid outline-none rounded-md py-2 px-4 ${
              messages.password ? 'border-red-600 text-red-600' : 'border-border-color'
            }`}
          />
          <span className='text-red-600 text-left'>{messages.password}</span>
        </div>

        <div className='mb-4 flex flex-col'>
          <input
            onBlur={handleValidation}
            onFocus={disableValidation}
            onChange={handleChange}
            type='password'
            name='rePassword'
            id='rePassword'
            placeholder='Nhập lại mật khẩu'
            className={`min-w-[18.75rem] md:min-w-[25rem] bg-input-color border border-solid outline-none rounded-md py-2 px-4 ${
              messages.rePassword ? 'border-red-600 text-red-600' : 'border-border-color'
            }`}
          />
          <span className='text-red-600 text-left'>{messages.rePassword}</span>
        </div>

        <input
          type='submit'
          value='Cập nhật mật khẩu'
          id='submitBtn'
          className='w-full lg:w-auto rounded-md bg-gradient-to-br from-primary-color to-secondary-color text-white font-bold py-2 px-16 cursor-pointer hover:animation-btn'
        />
      </form>
    </div>
  )
}
