import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Posts from '~/components/Posts'
import TextEditor from '~/components/TextEditor'
import { setPostsList } from '~/features/posts/postsSlice'
import DefaultLayout from '~/layouts/DefaultLayout'
import { RootState } from '~/store'
import fetchApi from '~/utils/fetchApi'

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
          {postsList.length > 0 && <Posts postsList={postsList} />}
        </div>
      </main>
    </DefaultLayout>
  )
}
