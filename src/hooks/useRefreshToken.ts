import fetchApi from '~/utils/fetchApi'
import useCookie from './useCookie'

const useRefreshToken = async (callback: () => Promise<void>, refreshToken: string) => {
  const [setCookie] = useCookie()
  const remember = localStorage.getItem('remember')
  try {
    const result = (await fetchApi.post('refresh', { refreshToken })).data
    setCookie('accessToken', result.accessToken, remember === 'true' ? 7 : 0)
    setCookie('refreshToken', result.refreshToken, remember === 'true' ? 7 : 0)
    callback()
  } catch (error) {
    console.log(error)
  }
}

export default useRefreshToken
