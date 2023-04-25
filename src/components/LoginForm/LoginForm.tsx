import { useState } from 'react'
import { toast } from 'react-toastify'

export default function LoginForm() {
  const [formData, setFormData] = useState<{ email: string; password: string; remember: boolean }>({
    email: '',
    password: '',
    remember: false
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value, remember: event.target.checked }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (formData.email === '') {
      toast('Mời bạn nhập email hoặc username', { position: 'top-right', type: 'warning', autoClose: 2000 })
    } else if (formData.password === '') {
      toast('Mời bạn nhập mật khẩu', { position: 'top-right', type: 'warning', autoClose: 2000 })
    } else {
      console.log(formData)
    }
  }

  return (
    <div className='p-8'>
      <h1 className='text-title-color text-24 font-bold text-center mb-8'>Đăng nhập</h1>
      <form className='text-14 text-center' autoComplete='off' onSubmit={handleSubmit}>
        <div className='mb-4'>
          <input
            onChange={handleChange}
            value={formData.email}
            className='min-w-[25rem] bg-input-color border border-solid outline-none rounded-md py-2 px-4 border-border-input-color'
            type='text'
            name='email'
            id='email'
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
          <span>Quên mật khẩu ?</span>
        </div>
        <input
          type='submit'
          value='Đăng nhập'
          id='submitBtn'
          className='mt-4 rounded-md bg-gradient-to-br from-primary-color to-secondary-color text-white font-bold py-2 px-16 cursor-pointer hover:animation-btn'
        />
      </form>
    </div>
  )
}
