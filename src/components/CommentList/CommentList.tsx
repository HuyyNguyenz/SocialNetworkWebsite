import { lazy, Suspense, useState, Fragment } from 'react'
import { Comment as CommentType, User } from '~/types'
import TextEditor from '../TextEditor'
import Loading from '../Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

interface Props {
  commentList: CommentType[]
  users: User[]
  authorPostId: number
  hasMore: (value: boolean) => void
  stopHasMore: boolean
  loading: boolean
}

const Comment = lazy(() => import('../Comment'))

export default function CommentList(props: Props) {
  const commentQuantity = useSelector((state: RootState) => state.commentList.data)
  const { commentList, users, authorPostId, stopHasMore, loading } = props
  const [typeSort, setTypeSort] = useState<string>('new')

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeSort(event.target.value)
  }

  const handleFindAuthor = (id: number) => {
    return users.find((user) => user.id === id) as User
  }

  const handleSortOldDate = (commentList: CommentType[]) => {
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

  const handleGetMoreComments = () => {
    props.hasMore(true)
  }

  const commentListSorted = typeSort === 'old' ? handleSortOldDate(commentList) : commentList

  return (
    <section>
      <div className='text-14 text-text-color dark:text-dark-text-color bg-bg-light dark:bg-bg-dark px-4 md:px-8 py-4 rounded-md rounded-tl-none rounded-tr-none border border-solid border-border-color dark:border-dark-border-color border-t-transparent text-center'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center justify-start text-18 text-title-color dark:text-dark-title-color'>
            <h2 className='font-bold'>Bình luận</h2>
            <span className='ml-2'>({commentQuantity.length})</span>
          </div>
          <select
            onChange={handleChange}
            value={typeSort}
            name='sortByDate'
            id='sortByDate'
            className='text-primary-color dark:text-dark-primary-color font-bold pr-2 outline-none cursor-pointer dark:bg-bg-dark'
          >
            <option className='font-bold' value='new'>
              Gần đây nhất
            </option>
            <option className='font-bold' value='old'>
              Cũ nhất
            </option>
          </select>
        </div>
        {commentList.length > 0 &&
          users.length > 0 &&
          commentListSorted.map((comment) => {
            const author = handleFindAuthor(comment.userId)
            return (
              <Fragment key={comment.id}>
                <Suspense fallback={<Loading quantity={1} />}>
                  <Comment comment={comment} author={author} authorPostId={authorPostId} />
                </Suspense>
              </Fragment>
            )
          })}
        {loading && (
          <div className='flex items-start justify-start mb-4'>
            <Skeleton className='w-8 h-8 object-cover rounded-md dark:bg-bg-dark' />
            <Skeleton className='w-[31.25rem] h-12 rounded-md ml-4 dark:bg-bg-dark' />
          </div>
        )}
        {commentList.length >= 5 && !stopHasMore && (
          <button
            onClick={handleGetMoreComments}
            className='text-primary-color dark:text-dark-primary-color font-bold hover:text-secondary-color transition-all ease-linear duration-200 mb-8'
          >
            <span className='mr-2'>Xem thêm</span>
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
        )}
        <TextEditor comment={true} />
      </div>
    </section>
  )
}
