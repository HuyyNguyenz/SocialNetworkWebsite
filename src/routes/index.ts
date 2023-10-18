import Friends from '~/pages/Friends'
import Home from '~/pages/Home'
import Login from '~/pages/Login'
import Chat from '~/pages/Chat'
import NotFound from '~/pages/NotFound'
import PostDetail from '~/pages/PostDetail'
import Recovery from '~/pages/Recovery'
import Register from '~/pages/Register'
import Profile from '~/pages/Profile'
import VerifyRegister from '~/pages/VerifyRegister'
import ProfileSetting from '~/pages/ProfileSetting'
import { Router } from '~/types'
import UserFriend from '~/pages/UserFriend'

const routes: Router[] = [
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/friends', component: Friends },
  { path: '/recovery', component: Recovery },
  { path: '/:author/post/:postId', component: PostDetail },
  { path: '/:username/profile/:userId/posts', component: Profile },
  { path: '/:username/profile/:userId/friends', component: UserFriend },
  { path: '/verify/register/:username', component: VerifyRegister },
  { path: '/message/:userFriendId', component: Chat },
  { path: '/:username/setting', component: ProfileSetting },
  { path: '/*', component: NotFound }
]

export default routes
