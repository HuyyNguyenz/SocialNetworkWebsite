import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PostItem from '~/components/PostItem'
import DefaultLayout from '~/layouts/DefaultLayout'
import { Comment, Post, User } from '~/types'
import fetchApi from '~/utils/fetchApi'
import CommentList from '~/components/CommentList'
import { useDispatch, useSelector } from 'react-redux'
import { setCommentList } from '~/features/comment/commentSlice'
import { RootState } from '~/store'

export default function PostDetail() {
  const userData = useSelector((state: RootState) => state.userData.data)
  const commentList = useSelector((state: RootState) => state.commentList.data)
  const [users, setUsers] = useState<User[]>([])
  const [authorData, setAuthorData] = useState<User>()
  const [post, setPost] = useState<Post>()
  const [comments, setComments] = useState<Comment[]>([])
  const { author, postId } = useParams()
  const dispatch = useDispatch()
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [stopHasMore, setStopHasMore] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const getComments = useCallback(
    async (controller?: AbortController) => {
      try {
        const comments: Comment[] = (
          await fetchApi.get(
            `comments-post/${postId}?limit=5&page=${page}`,
            controller && { signal: controller.signal }
          )
        ).data
        if (comments.length > 0) {
          isLoading
            ? setTimeout(() => {
                setLoading(false)
                setComments((prev) => [...prev, ...comments])
              }, 1000)
            : setComments((prev) => [...prev, ...comments])
        } else {
          setTimeout(() => {
            setLoading(false)
          }, 1000)
          setStopHasMore(true)
        }
        setHasMore(false)
        setPage((prev) => prev + 1)
      } catch (error: any) {
        error.name !== 'CanceledError' && console.log(error)
      }
    },
    [postId, page, isLoading]
  )

  useEffect(() => {
    post && post.type === 'private' && post.userId !== userData.id && navigate('/')
    post && post.deleted === 1 && navigate(`/${author}/post/${postId}/deleted`)
  }, [post, userData.id, navigate, author, postId])

  useEffect(() => {
    const controller = new AbortController()
    postId &&
      fetchApi
        .get(`post/${postId}`, { signal: controller.signal })
        .then((res) => setPost(res.data))
        .catch((error) => error.name !== 'CanceledError' && console.log(error))
    return () => {
      controller.abort()
    }
  }, [postId])

  useEffect(() => {
    const controller = new AbortController()
    postId && hasMore && getComments(controller)
    return () => {
      controller.abort()
    }
  }, [postId, getComments, hasMore])

  useEffect(() => {
    if (author) {
      const controller = new AbortController()
      fetchApi
        .get('users', { signal: controller.signal })
        .then((res) => {
          Array.from(res.data).forEach((user: any) => {
            user.username === author && setAuthorData(user)
          })
          setUsers(res.data)
        })
        .catch((error) => error.name !== 'CanceledError' && console.log(error))
      return () => {
        controller.abort()
      }
    }
  }, [author])

  useEffect(() => {
    return () => {
      dispatch(setCommentList([]))
    }
  }, [dispatch])

  useEffect(() => {
    const controller = new AbortController()
    commentList.length > 0 &&
      fetchApi
        .get(`comments-post/${postId}?limit=5&page=1`, { signal: controller.signal })
        .then((res) => {
          setComments(res.data)
          setPage(2)
        })
        .catch((error) => error.name !== 'CanceledError' && console.log(error))
    return () => {
      controller.abort()
    }
  }, [commentList, postId])

  return (
    <DefaultLayout>
      <main>
        <div className='md:w-[48rem] max-w-3xl my-0 mx-auto pt-28 pb-10'>
          {authorData && post && <PostItem post={post} author={authorData} detail={true} />}
          <CommentList
            loading={isLoading}
            commentList={comments}
            users={users}
            authorPostId={Number(post?.userId)}
            hasMore={(value) => {
              setLoading(true)
              setHasMore(value)
            }}
            stopHasMore={stopHasMore}
          />
        </div>
      </main>
    </DefaultLayout>
  )
}
