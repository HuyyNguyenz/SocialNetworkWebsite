import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TextEditor from '~/components/TextEditor'
import DefaultLayout from '~/layouts/DefaultLayout'
import { RootState } from '~/store'
import { setPostList } from '~/features/post/postSlice'
import fetchApi from '~/utils/fetchApi'
import { setCommentList } from '~/features/comment/commentSlice'
import PostList from '~/components/PostList'
import socialNetworkGif from '~/assets/images/social_network.gif'
import { Friend, Post } from '~/types'

export default function Home() {
  const postList = useSelector((state: RootState) => state.postList.data)
  const userData = useSelector((state: RootState) => state.userData)
  const dispatch = useDispatch()
  const [friends, setFriends] = useState<Friend[]>([])
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi.get('posts', { signal: controller.signal }).then((res) => {
      setPosts(res.data)
    })
    return () => {
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi.get('comments', { signal: controller.signal }).then((res) => {
      dispatch(setCommentList(res.data))
    })
    return () => {
      controller.abort()
    }
  }, [dispatch])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi.get('friends', { signal: controller.signal }).then((res) => {
      setFriends(res.data)
    })
    return () => {
      controller.abort()
    }
  }, [])

  useEffect(() => {
    if (posts.length > 0) {
      const postList: Post[] = []
      posts.filter((post) => {
        post.userId === userData.id && postList.push(post)
        friends.length > 0 &&
          friends.forEach((friend) => {
            post.userId === friend.friendId && friend.userId === userData.id && postList.push(post)
            post.userId === friend.userId &&
              friend.friendId === userData.id &&
              friend.status === 'accept' &&
              postList.push(post)
          })
      })
      dispatch(setPostList(postList))
    }
  }, [posts, friends, dispatch, userData])

  return (
    <DefaultLayout>
      <main>
        <div className='w-[48rem] max-w-3xl my-0 mx-auto pt-36 pb-10'>
          <TextEditor comment={false} />
          {postList.length === 0 ? (
            <div>
              <h2 className='text-18 uppercase font-semibold text-center bg-gradient-to-r from-primary-color to-secondary-color bg-clip-text text-transparent'>
                Hãy kết bạn để theo dõi nhiều bài viết hay hơn
              </h2>
              <img className='object-cover rounded-md' src={socialNetworkGif} alt='gif' />
            </div>
          ) : (
            <PostList postList={postList} profile={false} />
          )}
        </div>
      </main>
    </DefaultLayout>
  )
}
