import { lazy, Suspense, useState, Fragment } from 'react'
import { Comment as CommentType, User } from '~/types'
import TextEditor from '../TextEditor'
import Loading from '../Loading'

interface Props {
  commentList: CommentType[]
  users: User[]
  authorPostId: number
}

const Comment = lazy(() => import('../Comment'))

export default function CommentList(props: Props) {
  const { commentList, users, authorPostId } = props
  const [typeSort, setTypeSort] = useState<string>('new')
  const quantityComment = commentList.filter((comment) => comment.deleted === 0)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeSort(event.target.value)
  }

  const handleFindAuthor = (id: number) => {
    return users.find((user) => user.id === id) as User
  }

  const handleSortNewDate = (commentList: CommentType[]) => {
    const newCommentList = commentList
      .slice()
      .sort((a, b) => {
        const createdAt1 = a.createdAt.split(' ')[0]
        const createdAt2 = b.createdAt.split(' ')[0]
        return new Date(createdAt1).getTime() - new Date(createdAt2).getTime()
      })
      .reverse()
    return newCommentList
  }

  const handleSortOldDate = (commentList: CommentType[]) => {
    const newCommentList = commentList.slice().sort((a, b) => {
      const createdAt1 = a.createdAt.split(' ')[0]
      const createdAt2 = b.createdAt.split(' ')[0]
      return new Date(createdAt1).getTime() - new Date(createdAt2).getTime()
    })
    return newCommentList
  }

  const commentListSorted = typeSort === 'new' ? handleSortNewDate(commentList) : handleSortOldDate(commentList)

  return (
    <section>
      <div className='text-14 text-text-color bg-white px-8 py-4 rounded-md rounded-tl-none rounded-tr-none border border-solid border-border-color border-t-transparent'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center justify-start text-18 text-title-color'>
            <h2 className='font-bold'>Bình luận</h2>
            <span className='ml-2'>({quantityComment.length})</span>
          </div>
          <select
            onChange={handleChange}
            value={typeSort}
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
          commentListSorted.map((comment) => {
            const author = handleFindAuthor(comment.userId)
            return (
              <Fragment key={comment.id}>
                {comment.deleted === 0 && (
                  <Suspense fallback={<Loading quantity={1} />}>
                    <Comment comment={comment} author={author} authorPostId={authorPostId} />
                  </Suspense>
                )}
              </Fragment>
            )
          })}
        <TextEditor comment={true} />
      </div>
    </section>
  )
}
