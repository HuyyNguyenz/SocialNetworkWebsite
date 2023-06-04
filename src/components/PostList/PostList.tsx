import { Fragment, useEffect, useState } from 'react'
import { Post, User } from '~/types'
import fetchApi from '~/utils/fetchApi'
import PostItem from '../PostItem'

interface Props {
  postList: Post[]
}

export default function PostList(props: Props) {
  const { postList } = props
  const [users, setUsers] = useState<User[]>([])

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
            {post.type === 'public' && post.deleted === 0 && <PostItem post={post} author={author} detail={false} />}
          </Fragment>
        )
      })}
    </section>
  )
}
