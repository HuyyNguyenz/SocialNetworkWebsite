import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TextEditor from '~/components/TextEditor'
import DefaultLayout from '~/layouts/DefaultLayout'
import { RootState } from '~/store'
import { setNewPost, setPostList } from '~/features/post/postSlice'
import fetchApi from '~/utils/fetchApi'
import PostList from '~/components/PostList'
import socialNetworkGif from '~/assets/images/social_network.gif'
import { Friend, Post } from '~/types'
import Loading from '~/components/Loading'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function Home() {
  const postList = useSelector((state: RootState) => state.postList.data)
  const newPost = useSelector((state: RootState) => state.postList.newPost)
  const userData = useSelector((state: RootState) => state.userData)
  const sharePost = useSelector((state: RootState) => state.postList.sharePost)
  const dispatch = useDispatch()
  const [friends, setFriends] = useState<Friend[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [offset, setOffset] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(false)

  const getPostList = useCallback(
    async (controller?: AbortController) => {
      try {
        const result = (await fetchApi.get(`posts/5/${offset}`, controller && { signal: controller.signal })).data
        result.length === 0 ? setHasMore(false) : setPosts((prev) => [...prev, ...result])
        setOffset((prev) => prev + 5)
      } catch (error: any) {
        error.name !== 'CanceledError' && console.log(error)
      }
    },
    [offset]
  )

  const handleFilterPosts = useCallback(
    (postList: Post[]) => {
      const postIndex = postList.findIndex((post) => post.type === 'private' && post.userId !== userData.id)
      postIndex !== -1 && postList.splice(postIndex, 1)
      return postList
    },
    [userData.id]
  )

  useEffect(() => {
    setLoading(true)
    window.scrollTo(0, 0)

    return () => {
      dispatch(setPostList([]))
      dispatch(setNewPost(null))
    }
  }, [dispatch])

  useEffect(() => {
    const controller = new AbortController()
    posts.length === 0 && getPostList(controller)
    return () => {
      controller.abort()
    }
  }, [posts.length, getPostList])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi
      .get('friends', { signal: controller.signal })
      .then((res) => {
        setFriends(res.data)
      })
      .catch((error) => error.name !== 'CanceledError' && console.log(error))
    return () => {
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    if (posts.length > 0 && hasMore) {
      const postArray: Post[] = []
      posts.forEach((post) => {
        post.userId === userData.id && postArray.push(post)
        friends.length > 0 &&
          friends.forEach((friend) => {
            post.userId === friend.friendId && friend.userId === userData.id && postArray.push(post)
            post.userId === friend.userId &&
              friend.friendId === userData.id &&
              friend.status === 'accept' &&
              postArray.push(post)
          })
      })
      const filterPosts = handleFilterPosts(postArray)
      filterPosts.length === 0 ? getPostList(controller) : dispatch(setPostList(filterPosts))
    }
    const loading = setTimeout(() => {
      isLoading && setLoading(false)
    }, 1000)
    return () => {
      clearTimeout(loading)
      controller.abort()
    }
  }, [posts, friends, dispatch, userData, isLoading, getPostList, hasMore, handleFilterPosts])

  useEffect(() => {
    if (newPost !== null) {
      const controller = new AbortController()
      fetchApi
        .get(`posts/5/0`, { signal: controller.signal })
        .then((res) => {
          setPosts(res.data)
          setHasMore(true)
          setOffset(5)
        })
        .catch((error) => error.name !== 'CanceledError' && console.log(error))
      return () => {
        controller.abort()
      }
    }
  }, [newPost])

  return (
    <DefaultLayout>
      <main>
        <div className='w-[48rem] max-w-3xl my-0 mx-auto pt-36 pb-10'>
          {!sharePost && <TextEditor comment={false} />}
          {isLoading ? (
            <Loading quantity={5} />
          ) : postList.length > 0 ? (
            <InfiniteScroll
              dataLength={posts.length}
              next={getPostList}
              hasMore={hasMore}
              loader={<Loading quantity={1} />}
            >
              <PostList postList={postList} profile={false} />
            </InfiniteScroll>
          ) : (
            <div>
              <h2 className='text-18 uppercase font-semibold text-center bg-gradient-to-r from-primary-color dark:from-dark-primary-color to-secondary-color dark:to-secondary-color bg-clip-text text-transparent'>
                Hãy kết bạn để theo dõi nhiều bài viết hay hơn
              </h2>
              <img loading='lazy' className='object-cover rounded-md' src={socialNetworkGif} alt='gif' />
            </div>
          )}
        </div>
      </main>
    </DefaultLayout>
  )
}
