import Communities from '~/pages/Communities'
import Friends from '~/pages/Friends'
import Home from '~/pages/Home'
import Login from '~/pages/Login'
import NotFound from '~/pages/NotFound'
import PostDetail from '~/pages/PostDetail'
import Recovery from '~/pages/Recovery'
import Register from '~/pages/Register'
import UserProfile from '~/pages/UserProfile'
import { Router } from '~/types'

const publicRoutes: Router[] = [
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/friends', component: Friends },
  { path: '/communities', component: Communities },
  { path: '/recovery', component: Recovery },
  { path: '/:author/post/:postId', component: PostDetail },
  { path: '/profile/:userId/posts', component: UserProfile },
  { path: '/*', component: NotFound }
]

const privateRoutes = []

export { publicRoutes }
