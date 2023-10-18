import InfiniteScroll from 'react-infinite-scroll-component'
import Loading from '~/components/Loading'
import PostList from '~/components/PostList'
import TextEditor from '~/components/TextEditor'
import postGif from '~/assets/images/post.gif'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import { useEffect, useState } from 'react'
import { setNewPost, setPostList } from '~/features/post/postSlice'
import fetchApi from '~/utils/fetchApi'
import { setCommentList } from '~/features/comment/commentSlice'
import UserProfileLayout from '~/layouts/UserProfileLayout'

export default function Profile() {
  const { userId } = useParams()
  const userData = useSelector((state: RootState) => state.userData.data)
  const postList = useSelector((state: RootState) => state.postList.data)
  const newPost = useSelector((state: RootState) => state.postList.newPost)
  const [page, setPage] = useState<number>(2)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const dispatch = useDispatch()

  const getPostList = async () => {
    const result = (await fetchApi.get(`posts-user/${userId}?limit=5&page=${page}`)).data
    result.length === 0 ? setHasMore(false) : dispatch(setPostList([...postList, ...result]))
    setPage((prev) => prev + 1)
  }

  useEffect(() => {
    if (userId || newPost !== null) {
      const controller = new AbortController()
      fetchApi
        .get(`posts-user/${userId}?limit=5&page=1`, { signal: controller.signal })
        .then((res) => {
          dispatch(setPostList(res.data))
          setHasMore(true)
          setPage(2)
        })
        .catch((error) => error.name !== 'CanceledError' && console.log(error))
      return () => {
        controller.abort()
      }
    }
  }, [userId, dispatch, newPost])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi
      .get('comments', { signal: controller.signal })
      .then((res) => {
        dispatch(setCommentList(res.data))
      })
      .catch((error) => error.name !== 'CanceledError' && console.log(error))
    return () => {
      controller.abort()
    }
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch(setPostList([]))
      dispatch(setNewPost(null))
    }
  }, [dispatch])

  return (
    <UserProfileLayout>
      {userData.id === Number(userId) && <TextEditor comment={false} />}
      {postList.length > 0 ? (
        <InfiniteScroll
          dataLength={postList.length}
          next={getPostList}
          hasMore={hasMore}
          loader={<Loading quantity={1} />}
        >
          <PostList postList={postList} profile={true} />
        </InfiniteScroll>
      ) : (
        <div>
          <h2 className='px-4 md:px-0 mb-2 text-16 md:text-18 uppercase font-semibold text-center bg-gradient-to-r from-primary-color dark:from-dark-primary-color to-secondary-color dark:to-secondary-color bg-clip-text text-transparent'>
            {userData.id === Number(userId)
              ? 'Hãy cho chúng tôi biết cảm nghĩ của bạn'
              : 'Người dùng hiện tại chưa có bài viết.'}
          </h2>
          <img className='object-cover rounded-md' src={postGif} alt='gif' />
        </div>
      )}
    </UserProfileLayout>
  )
}
