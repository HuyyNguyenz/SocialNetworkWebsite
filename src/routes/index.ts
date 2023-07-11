import Friends from '~/pages/Friends'
import Home from '~/pages/Home'
import Login from '~/pages/Login'
import Message from '~/pages/Message'
import NotFound from '~/pages/NotFound'
import PostDetail from '~/pages/PostDetail'
import Recovery from '~/pages/Recovery'
import Register from '~/pages/Register'
import UserProfile from '~/pages/UserProfile'

import VerifyRegister from '~/pages/VerifyRegister'
import { Router } from '~/types'

const publicRoutes: Router[] = [
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/friends', component: Friends },
  { path: '/recovery', component: Recovery },
  { path: '/:author/post/:postId', component: PostDetail },
  { path: ':username/profile/:userId/posts', component: UserProfile },
  { path: '/verify/register/:username', component: VerifyRegister },
  { path: '/message/:userFriendId', component: Message },
  { path: '/*', component: NotFound }
]

const privateRoutes = []

export { publicRoutes }
