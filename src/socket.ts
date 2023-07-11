import { io } from 'socket.io-client'

const URL = import.meta.env.VITE_SOCKET_URL as string

const socket = io(URL)
export default socket
