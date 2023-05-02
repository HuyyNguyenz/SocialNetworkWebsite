import Home from '~/pages/Home'
import Login from '~/pages/Login'
import Register from '~/pages/Register'
import { Router } from '~/types'

const publicRoutes: Router[] = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/register',
    component: Register
  },
  { path: '/login', component: Login }
]

const privateRoutes = []

export { publicRoutes }
