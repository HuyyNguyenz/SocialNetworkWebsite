import { io } from 'socket.io-client'
import cookie from '~/hooks/useCookie'

const [, getCookie] = cookie()
const accessToken = getCookie('accessToken')
const socket = io(import.meta.env.VITE_SOCKET_URL as string, {
  auth: {
    Authorization: `Bearer ${accessToken}`
  }
})
export default socket
