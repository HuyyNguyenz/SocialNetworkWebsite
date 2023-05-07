import { useNavigate } from 'react-router-dom'
import useCookie from '~/hooks/useCookie'
import DefaultLayout from '~/layouts/DefaultLayout'
import fetchApi from '~/utils/fetchApi'

export default function Home() {
  const { getCookie, setCookie, removeCookie } = useCookie()
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.clear()
    removeCookie('refreshToken')
    navigate('/login')
  }

  const handleGetUsers = () => {
    const accessToken = localStorage.getItem('accessToken')
    const getUser = async () => {
      try {
        const result = (await fetchApi.get('users', { headers: { token: `Bearer ${accessToken}` } })).data
        console.log(result)
      } catch (error: any) {
        if (error.response.data === 'Token is not valid') {
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
    <DefaultLayout>
      <main>
        <div className='h-[2000px] pt-32'>
          <h1>Home Page</h1>
          <button onClick={handleLogout}>Đăng xuất</button>
          <br />
          <button onClick={handleGetUsers}>Get users</button>
        </div>
      </main>
    </DefaultLayout>
  )
}
