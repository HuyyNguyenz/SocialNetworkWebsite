import { Suspense, lazy, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useDispatch, useSelector } from 'react-redux'
import TextEditor from '~/components/TextEditor'
import { setPostsList } from '~/features/posts/postsSlice'
import DefaultLayout from '~/layouts/DefaultLayout'
import { RootState } from '~/store'
import fetchApi from '~/utils/fetchApi'

const Posts = lazy(() => import('~/components/Posts'))

export default function Home() {
  const postsList = useSelector((state: RootState) => state.postsList)
  const dispatch = useDispatch()

  useEffect(() => {
    if (postsList.length === 0) {
      const controller = new AbortController()
      fetchApi.get('posts', { signal: controller.signal }).then((res) => {
        dispatch(setPostsList(res.data))
      })
      return () => {
        controller.abort()
      }
    }
  }, [postsList, dispatch])

  return (
    <DefaultLayout>
      <main>
        <div className='relative w-[48rem] max-w-3xl my-0 mx-auto pt-36 pb-10'>
          <TextEditor />
          {postsList.length > 0 && (
            <Suspense fallback={<Skeleton className='h-[25rem] mt-8' />}>
              <Posts postsList={postsList} />
            </Suspense>
          )}
        </div>
      </main>
    </DefaultLayout>
  )
}
