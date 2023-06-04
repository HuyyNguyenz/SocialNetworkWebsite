import { lazy, Suspense, useEffect } from 'react'
import { Comment as CommentType, User } from '~/types'
import TextEditor from '../TextEditor'
import Loading from '../Loading'
// import Comment from '../Comment'

interface Props {
  commentList: CommentType[]
  users: User[]
}

const Comment = lazy(() => import('../Comment'))

export default function CommentList(props: Props) {
  const { commentList, users } = props

  const handleFindAuthor = (id: number) => {
    return users.find((user) => user.id === id) as User
  }

  return (
    <section>
      <div className='text-14 text-text-color bg-white px-8 py-4 rounded-md rounded-tl-none rounded-tr-none border border-solid border-border-color border-t-transparent'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center justify-start text-18 text-title-color'>
            <h2 className='font-bold'>Bình luận</h2>
            <span className='ml-2'>({commentList.length})</span>
          </div>
          <select
            name='sortByDate'
            id='sortByDate'
            className='text-primary-color font-bold pr-2 outline-none cursor-pointer'
          >
            <option value='new'>Gần đây nhất</option>
            <option value='old'>Cũ nhất</option>
          </select>
        </div>
        {commentList.length > 0 &&
          users.length > 0 &&
          commentList.map((comment) => {
            const author = handleFindAuthor(comment.userId)
            return (
              <Suspense fallback={<Loading quantity={1} />} key={comment.id}>
                <Comment comment={comment} author={author} />
              </Suspense>
            )
          })}
        <TextEditor comment={true} />
      </div>
    </section>
  )
}
