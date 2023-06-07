import { Suspense, lazy, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '~/components/Loading'
import TextEditor from '~/components/TextEditor'
import DefaultLayout from '~/layouts/DefaultLayout'
import { RootState } from '~/store'
import { setPostList } from '~/features/post/postSlice'
import fetchApi from '~/utils/fetchApi'
import { setCommentList } from '~/features/comment/commentSlice'

const PostList = lazy(() => import('~/components/PostList'))

export default function Home() {
  const postList = useSelector((state: RootState) => state.postList.data)
  const dispatch = useDispatch()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
    <DefaultLayout>
      <main>
        <div className='w-[48rem] max-w-3xl my-0 mx-auto pt-36 pb-10'>
          <TextEditor comment={false} />
          <Suspense fallback={<Loading quantity={3} />}>
            <PostList postList={postList} profile={false} />
          </Suspense>
        </div>
      </main>
    </DefaultLayout>
  )
}
