import { useNavigate } from 'react-router-dom'
import useCookie from '~/hooks/useCookie'
import DefaultLayout from '~/layouts/DefaultLayout'

export default function Home() {
  const { removeCookie } = useCookie()
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.clear()
    removeCookie('refreshToken')
    navigate('/login')
  }

  return (
    <DefaultLayout>
      <main>
        <div className='h-[2000px] pt-32'>
          <h1>Home Page</h1>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      </main>
    </DefaultLayout>
  )
}
