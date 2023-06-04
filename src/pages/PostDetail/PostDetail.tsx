import { useEffect, lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { RootState } from '~/store'
import { useState } from 'react'
import PostItem from '~/components/PostItem'
import DefaultLayout from '~/layouts/DefaultLayout'
import { Comment, Post, User } from '~/types'
import fetchApi from '~/utils/fetchApi'
import { setCommentList } from '~/features/comment/commentSlice'
import { setPostList } from '~/features/post/postSlice'
import CommentList from '~/components/CommentList'

export default function PostDetail() {
  const postList = useSelector((state: RootState) => state.postList.data)
  const commentList = useSelector((state: RootState) => state.commentList.data)
  const [users, setUsers] = useState<User[]>([])
  const [authorData, setAuthorData] = useState<User>()
  const [post, setPost] = useState<Post>()
  const [comments, setComments] = useState<Comment[]>([])
  const { author, postId } = useParams()
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

  useEffect(() => {
    if (author) {
      const controller = new AbortController()
      fetchApi.get('users', { signal: controller.signal }).then((res) => {
        Array.from(res.data).forEach((user: any) => {
          user.username === author && setAuthorData(user)
        })
        setUsers(res.data)
      })
      return () => {
        controller.abort()
      }
    }
  }, [author])

  useEffect(() => {
    if (postId) {
      postList.find((post) => {
        post.id === Number(postId) && setPost(post)
      })
    }
  }, [postId, postList])

  useEffect(() => {
    if (commentList.length > 0) {
      const newCommentList: Comment[] = []
      commentList.forEach((comment) => comment.postId === Number(postId) && newCommentList.push(comment))
      setComments(newCommentList)
    }
  }, [commentList, postId])

  return (
    <DefaultLayout>
      <main>
        <div className='relative w-[48rem] max-w-3xl my-0 mx-auto pt-28 pb-10'>
          {authorData && post && <PostItem post={post} author={authorData} detail={true} />}
          <CommentList commentList={comments} users={users} />
        </div>
      </main>
    </DefaultLayout>
  )
}
