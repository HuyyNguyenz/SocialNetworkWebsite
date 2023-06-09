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
    if (users.length === 0) {
      const controller = new AbortController()
      fetchApi.get('users', { signal: controller.signal }).then((res) => setUsers(res.data))
      return () => {
        controller.abort()
      }
    }
  }, [users])

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

  return (
    <section>
      {handleSortByDate(postList).map((post) => {
        const author = handleFindAuthor(post.userId) as User
        return (
          <Fragment key={post.id}>
            {!profile && post.type === 'public' && post.deleted === 0 && (
              <Suspense fallback={<Loading quantity={1} />}>
                <PostItem post={post} author={author} detail={false} />
              </Suspense>
            )}
            {profile && userId === author?.username && post.deleted === 0 && post.type === 'public' && (
              <Suspense fallback={<Loading quantity={1} />}>
                <PostItem post={post} author={author} detail={false} />
              </Suspense>
            )}
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
    </section>
  )
}
