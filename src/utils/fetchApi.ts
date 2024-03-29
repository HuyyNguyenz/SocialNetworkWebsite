import axios, { AxiosInstance } from 'axios'
import cookie from '~/hooks/useCookie'

const [setCookie, getCookie] = cookie()
class Http {
  instance: AxiosInstance
  requestRefreshToken: any
  constructor() {
    this.requestRefreshToken = null
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 10000
    })
    this.instance.interceptors.request.use(
      (config) => {
        const accessToken = getCookie('accessToken') as string
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )
    this.instance.interceptors.response.use(
      (config) => config,
      (error) => {
        const { message } = error.response.data
        if (message && message === 'Access token is not valid') {
          this.requestRefreshToken = this.requestRefreshToken
            ? this.requestRefreshToken
            : handleRefreshToken().finally(() => (this.requestRefreshToken = null))
          return this.requestRefreshToken.then(() => this.instance(error.response.config))
        } else {
          return Promise.reject(error)
        }
      }
    )
  }
  get = (url: string, config?: object) => {
    return this.instance.get(url, config)
  }
  post = (url: string, body: object, config?: object) => {
    return this.instance.post(url, body, config)
  }
  put = (url: string, body: object, config?: object) => {
    return this.instance.put(url, body, config)
  }
  delete = (url: string, config?: object) => {
    return this.instance.delete(url, config)
  }
}

const handleRefreshToken = async () => {
  const remember = localStorage.getItem('remember')
  const refreshToken = getCookie('refreshToken') as string
  if (refreshToken) {
    try {
      const result = (await fetchApi.post('refresh-token', { refreshToken })).data
      setCookie('accessToken', result.accessToken, remember === 'true' ? 7 : 0)
      setCookie('refreshToken', result.refreshToken, remember === 'true' ? 7 : 0)
      return result
    } catch (error: any) {
      throw error.response
    }
  }
}
const fetchApi = new Http()
export default fetchApi
