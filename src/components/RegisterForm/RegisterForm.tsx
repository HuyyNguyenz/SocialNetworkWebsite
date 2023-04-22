export default function RegisterForm() {
  return (
    <div className='p-8'>
      <h1 className='text-title-color text-24 font-bold text-center mb-8'>Đăng ký tài khoản</h1>
      <form className='text-14 text-center'>
        <div className='mb-4 flex items-center justify-start'>
          <input
            className='bg-input-color border border-solid border-border-input-color outline-none rounded-md py-2 px-4 mr-4 '
            type='text'
            name='firstName'
            id='firstName'
            placeholder='Họ lót'
          />
          <input
            className='bg-input-color border border-solid border-border-input-color outline-none rounded-md py-2 px-4 '
            type='text'
            name='lastName'
            id='lastName'
            placeholder='Tên'
          />
        </div>
        <div className='mb-4'>
          <input
            className='w-full bg-input-color border border-solid border-border-input-color outline-none rounded-md py-2 px-4 '
            type='email'
            name='email'
            id='email'
            placeholder='Email'
          />
        </div>
        <div className='mb-4'>
          <input
            className='w-full bg-input-color border border-solid border-border-input-color outline-none rounded-md py-2 px-4 '
            type='password'
            name='password'
            id='password'
            placeholder='Mật khẩu'
          />
        </div>
        <div className='mb-4 flex flex-col items-start justify-start text-left'>
          <label htmlFor='birthDay' className='mb-2'>
            Ngày sinh
          </label>
          <input
            className='w-full bg-input-color border border-solid border-border-input-color outline-none rounded-md py-2 px-4 '
            type='date'
            name='birthDay'
            id='birthDay'
            min='1943-01-01'
          />
        </div>
        <div className='mb-4 text-left'>
          <label htmlFor='gender'>Giới tính</label>
          <div className='flex items-start justify-start mt-2'>
            <div className='flex items-center justify-start bg-input-color border border-solid border-border-input-color outline-none rounded-md py-2 px-4 mr-4'>
              <label htmlFor='male' className='mr-2'>
                Nam
              </label>
              <input type='radio' name='gender' id='male' />
            </div>
            <div className='flex items-center justify-start bg-input-color border border-solid border-border-input-color outline-none rounded-md py-2 px-4'>
              <label htmlFor='female' className='mr-2'>
                Nữ
              </label>
              <input type='radio' name='gender' id='female' />
            </div>
          </div>
        </div>
        <input
          type='submit'
          value='Đăng ký'
          className='mt-4 rounded-md bg-gradient-to-br from-primary-color to-secondary-color text-white font-bold py-2 px-16 cursor-pointer hover:animation-btn'
        />
      </form>
    </div>
  )
}
