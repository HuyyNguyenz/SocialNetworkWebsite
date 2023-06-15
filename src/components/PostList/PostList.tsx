import { Fragment, useEffect, useState, lazy, Suspense } from 'react'
import { Post, User } from '~/types'
import fetchApi from '~/utils/fetchApi'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import Loading from '../Loading'
import postGif from '~/assets/images/post.gif'

const PostItem = lazy(() => import('~/components/PostItem'))

interface Props {
  postList: Post[]
  profile: boolean
}

export default function PostList(props: Props) {
  const { postList, profile } = props
  const [users, setUsers] = useState<User[]>([])
  const { userId } = useParams()
  const userData = useSelector((state: RootState) => state.userData)

  useEffect(() => {
    const controller = new AbortController()
    fetchApi.get('users', { signal: controller.signal }).then((res) => setUsers(res.data))
    return () => {
      controller.abort()
    }
  }, [])

  const handleFindAuthor = (id: number) => {
    return users.find((user) => user.id === id)
  }

  const handleSortByDate = (postList: Post[]) => {
    const newPostList = postList
      .slice()
      .sort((a, b) => {
        const createdAt1 = a.createdAt.split(' ')[0]
        const createdAt2 = b.createdAt.split(' ')[0]
        return new Date(createdAt1).getTime() - new Date(createdAt2).getTime()
      })
      .reverse()
    return newPostList
  }

  const handleCheckPostListNullCurrentUser = (postList: Post[]) => {
    const postArray: Post[] = []
    postList.forEach((post) => {
      post.userId === userData.id && postArray.push(post)
    })
    return postArray.length
  }

  const handleCheckPostListNullOtherUser = (postList: Post[]) => {
    const postArray: Post[] = []
    postList.forEach((post) => {
      users.forEach((user) => user.id === post.userId && user.username === userId && postArray.push(post))
    })
    return postArray.length
  }

  return (
    <section>
      {handleSortByDate(postList).map((post) => {
        const author = handleFindAuthor(post.userId) as User
        return (
          <Fragment key={post.id}>
            {/* Các bài viết trang chủ */}
            {!profile && post.type === 'public' && post.deleted === 0 && (
              <Suspense fallback={<Loading quantity={1} />}>
                <PostItem post={post} author={author} detail={false} />
              </Suspense>
            )}
            {/* Các bài viết ở trang cá nhân */}
            {profile && userId === author?.username && post.deleted === 0 && post.type === 'public' && (
              <Suspense fallback={<Loading quantity={1} />}>
                <PostItem post={post} author={author} detail={false} />
              </Suspense>
            )}
            {/* Các bài viết ở trang cá nhân (riêng tư) */}
            {profile &&
              userId === author?.username &&
              post.deleted === 0 &&
              post.type === 'private' &&
              userData.username === userId && (
                <Suspense fallback={<Loading quantity={1} />}>
                  <PostItem post={post} author={author} detail={false} />
                </Suspense>
              )}
          </Fragment>
        )
      })}
      {profile && handleCheckPostListNullCurrentUser(postList) === 0 && userId === userData.username && (
        <div>
          <h2 className='text-18 uppercase font-semibold text-center bg-gradient-to-r from-primary-color to-secondary-color bg-clip-text text-transparent'>
            {userData.username === userId
              ? 'Hãy cho chúng tôi biết cảm nghĩ của bạn'
              : 'Người dùng hiện tại chưa có bài viết.'}
          </h2>
          <img className='object-cover rounded-md' src={postGif} alt='gif' />
        </div>
      )}
      {profile && handleCheckPostListNullOtherUser(postList) === 0 && userId !== userData.username && (
        <div>
          <h2 className='text-18 uppercase font-semibold text-center bg-gradient-to-r from-primary-color to-secondary-color bg-clip-text text-transparent'>
            {userData.username === userId
              ? 'Hãy cho chúng tôi biết cảm nghĩ của bạn'
              : 'Người dùng hiện tại chưa có bài viết.'}
          </h2>
          <img className='object-cover rounded-md' src={postGif} alt='gif' />
        </div>
      )}
    </section>
  )
}
