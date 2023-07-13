import { Fragment, useEffect, useState, lazy, Suspense } from 'react'
import { Post, User } from '~/types'
import fetchApi from '~/utils/fetchApi'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import Loading from '../Loading'

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
    fetchApi
      .get('users', { signal: controller.signal })
      .then((res) => setUsers(res.data))
      .catch((error) => error.name !== 'CanceledError' && console.log(error))
    return () => {
      controller.abort()
    }
  }, [])

  const handleFindAuthor = (id: number) => {
    return users.find((user) => user.id === id)
  }

  return (
    <section>
      {postList.map((post) => {
        const author = handleFindAuthor(post.userId) as User
        return (
          <Fragment key={post.id}>
            {/* Các bài viết trang chủ (công khai) */}
            {!profile && post.type === 'public' && post.deleted === 0 && (
              <Suspense fallback={<Loading quantity={1} />}>
                <PostItem post={post} author={author} detail={false} />
              </Suspense>
            )}
            {/* Các bài viết trang chủ (riêng tư) */}
            {!profile && post.type === 'private' && post.userId === userData.id && post.deleted === 0 && (
              <Suspense fallback={<Loading quantity={1} />}>
                <PostItem post={post} author={author} detail={false} />
              </Suspense>
            )}
            {/* Các bài viết ở trang cá nhân (công khai) */}
            {profile && Number(userId) === author?.id && post.deleted === 0 && post.type === 'public' && (
              <Suspense fallback={<Loading quantity={1} />}>
                <PostItem post={post} author={author} detail={false} />
              </Suspense>
            )}
            {/* Các bài viết ở trang cá nhân (riêng tư) */}
            {profile &&
              Number(userId) === author?.id &&
              post.deleted === 0 &&
              post.type === 'private' &&
              userData.id === Number(userId) && (
                <Suspense fallback={<Loading quantity={1} />}>
                  <PostItem post={post} author={author} detail={false} />
                </Suspense>
              )}
          </Fragment>
        )
      })}
    </section>
  )
}
