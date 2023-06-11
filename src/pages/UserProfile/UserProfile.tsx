import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PostList from '~/components/PostList'
import TextEditor from '~/components/TextEditor'
import { setCommentList } from '~/features/comment/commentSlice'
import { setPostList } from '~/features/post/postSlice'
import UserProfileLayout from '~/layouts/UserProfileLayout'
import { RootState } from '~/store'
import fetchApi from '~/utils/fetchApi'

export default function UserProfile() {
  const userData = useSelector((state: RootState) => state.userData)
  const postList = useSelector((state: RootState) => state.postList.data)
  const { userId } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    const controller = new AbortController()
    fetchApi.get('posts', { signal: controller.signal }).then((res) => {
      dispatch(setPostList(res.data))
    })
    return () => {
      controller.abort()
    }
  }, [dispatch])

  useEffect(() => {
    const controller = new AbortController()
    fetchApi.get('comments', { signal: controller.signal }).then((res) => {
      dispatch(setCommentList(res.data))
    })
    return () => {
      controller.abort()
    }
  }, [dispatch])

  return (
    <UserProfileLayout>
      {userData.username === userId && <TextEditor comment={false} />}
      {postList.length > 0 && <PostList postList={postList} profile={true} />}
    </UserProfileLayout>
  )
}
