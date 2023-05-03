import Home from '~/pages/Home'
import Login from '~/pages/Login'
import NotFound from '~/pages/NotFound'
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
  { path: '/login', component: Login },
  { path: '/*', component: NotFound }
]

const privateRoutes = []

export { publicRoutes }
