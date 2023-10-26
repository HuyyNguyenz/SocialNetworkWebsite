import { useState, useEffect } from 'react'
import { Comment, ExtraPost, Post, User } from '~/types'
import moment from 'moment'
import userImg from '~/assets/images/user.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots, faEarthAmericas, faLock, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import SettingPost from '../SettingPost'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import fetchApi from '~/utils/fetchApi'
import { setCommentList } from '~/features/comment/commentSlice'
import socket from '~/socket'
import { RootState } from '~/store'
import Linkify from 'react-linkify'
import { load } from 'cheerio'
import PopupImage from '../PopupImage'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import loadingImage from '~/assets/images/loading_image.png'
import ShareOption from '../ShareOption'

interface Props {
  post: Post
  author: User
  detail: boolean
  share?: boolean
}

export default function PostItem(props: Props) {
  const { post, author, detail, share } = props
  const userData = useSelector((state: RootState) => state.userData.data)
  const commentList = useSelector((state: RootState) => state.commentList.data)
  const createdAt = moment(post.createdAt, 'DD/MM/YYYY hh:mm').fromNow()
  const modifiedAt = moment(post.modifiedAt, 'DD/MM/YYYY hh:mm').fromNow()
  const [isReload, setReload] = useState<boolean>(false)
  const [likes, setLikes] = useState<ExtraPost[]>([])
  const [shares, setShares] = useState<ExtraPost[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [article, setArticle] = useState<{
    siteName: string
    title: string
    description: string
    thumbnail: string
    link: string
  }>()
  const [zoomImage, setZoomImage] = useState<{ src: string; name: string } | null>(null)
  const [sharePost, setSharePost] = useState<Post | null>(null)
  const [authorSharePost, setAuthorSharePost] = useState<User | null>(null)
  const dispatch = useDispatch()

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank')
  }

  const linkDecorator = (href: string, text: string, key: any) => {
    return (
      <a
        className={`article-${post.id}`}
        rel='noreferrer'
        href={href}
        key={key}
        target='_blank'
        onClick={() => handleLinkClick(href)}
      >
        {text}
      </a>
    )
  }

  const handleZoomImage = (src: string, name: string) => {
    document.body.classList.add('overflow-hidden')
    setZoomImage({ src, name })
  }

  const handleCloseZoom = (isClosed: boolean) => {
    if (isClosed) {
      document.body.classList.remove('overflow-hidden')
      setZoomImage(null)
    }
  }

  const handleLikePost = async () => {
    await fetchApi.post('like/post', { userId: userData.id, postId: post.id, type: 'like', receiverId: post.userId })
    post.userId !== userData.id &&
      socket.emit('sendUserLikedPost', { userId: userData.id, postId: post.id, receiverId: post.userId })
    setReload(true)
  }

  const handleUnlikePost = async () => {
    const ep = handleCheckLikedPost()
    await fetchApi.delete(`unlike/post/${ep?.id}`)
    post.userId !== userData.id &&
      socket.emit('sendUserLikedPost', { userId: userData.id, postId: post.id, receiverId: post.userId })
    setReload(true)
  }

  const handleCheckLikedPost = () => {
    return likes.find((likePost) => likePost.userId === userData.id)
  }

  useEffect(() => {
    const controller = new AbortController()
    post &&
      fetchApi
        .get(`comments-post/${post.id}?limit=0&page=0`, { signal: controller.signal })
        .then((res) => {
          detail ? dispatch(setCommentList(res.data)) : setComments(res.data)
        })
        .catch((error) => error.name !== 'CanceledError' && console.log(error))
    return () => {
      controller.abort()
    }
  }, [post, detail, dispatch])

  useEffect(() => {
    const controller = new AbortController()
    socket.on('sendCommentNotify', (res: any) => {
      res.message !== '' &&
        fetchApi
          .get(`comments-post/${post.id}?limit=0&page=0`, { signal: controller.signal })
          .then((res) => {
            detail ? dispatch(setCommentList(res.data)) : setComments(res.data)
          })
          .catch((error) => error.name !== 'CanceledError' && console.log(error))
    })
    return () => {
      controller.abort()
    }
  }, [dispatch, detail, post.id])

  useEffect(() => {
    const controller = new AbortController()
    const articleElement = document.querySelector(`.article-${post.id}`) as HTMLAnchorElement
    if (post && articleElement) {
      if (articleElement.text.includes(import.meta.env.VITE_HOST_URL) && articleElement.text.includes('/post/')) {
        const postId = Number(articleElement.text.split('/post/')[1])
        const usernameAuthor = articleElement.text.split('/')[3]
        fetchApi
          .get(`post/${postId}`, { signal: controller.signal })
          .then((res) => setSharePost(res.data))
          .catch((error) => error.name !== 'CanceledError' && console.log(error))
        fetchApi
          .get(`user/${usernameAuthor}`, { signal: controller.signal })
          .then((res) => setAuthorSharePost(res.data))
          .catch((error) => error.name !== 'CanceledError' && console.log(error))
      } else {
        fetchApi
          .get(`article?link=${articleElement.text}`, { signal: controller.signal })
          .then((res) => {
            const $ = load(res.data)
            const siteName = $('meta[property="og:site_name"]').attr('content') as string
            const title = $('meta[property="og:title"]').attr('content') as string
            const description = $('meta[property="og:description"]').attr('content') as string
            const thumbnail = $('meta[property="og:image"]').attr('content') as string
            setArticle({ siteName, title, description, thumbnail, link: articleElement.text })
          })
          .catch((error) => error.name !== 'CanceledError' && console.log(error))
      }
    }

    return () => {
      controller.abort()
    }
  }, [post])

  useEffect(() => {
    const controller = new AbortController()
    if (post) {
      fetchApi
        .get(`likes/post/${post.id}`, { signal: controller.signal })
        .then((res) => setLikes(res.data))
        .catch((error) => error.name !== 'CanceledError' && console.log(error))
      fetchApi
        .get(`shares/post/${post.id}`, { signal: controller.signal })
        .then((res) => setShares(res.data))
        .catch((error) => error.name !== 'CanceledError' && console.log(error))
    }
    isReload && setReload(false)
    return () => {
      controller.abort()
    }
  }, [post, isReload])

  useEffect(() => {
    socket.on('receiveUserLikedPost', () => {
      !isReload && setReload(true)
    })
  }, [isReload])

  return (
    <div
      className={`w-full px-4 md:px-8 py-4 bg-bg-light dark:bg-bg-dark rounded-md text-14 text-text-color dark:text-dark-text-color border border-solid border-border-color dark:border-dark-border-color ${
        detail ? 'rounded-br-none rounded-bl-none mt-8' : share ? '' : 'mb-8'
      }`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-start'>
          <Link to={`/${author && author.username}/profile/${author && author.id}/posts`}>
            <LazyLoadImage
              placeholderSrc={userImg}
              effect='blur'
              width={'2rem'}
              height={'2rem'}
              className='w-8 h-8 rounded-md object-cover'
              src={author?.avatar ? author?.avatar.url : userImg}
              alt={author?.firstName + ' ' + author?.lastName}
            />
          </Link>
          <div className='flex flex-col items-start justify-start ml-4'>
            <Link to={`/${author && author.username}/profile/${author && author.id}/posts`}>
              <span className='font-bold text-primary-color dark:text-dark-primary-color text-16'>
                {author?.firstName + ' ' + author?.lastName}
              </span>
            </Link>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-start'>
              <div>
                <span className='mr-2'>{createdAt}</span>
                {post.type === 'public' ? (
                  <FontAwesomeIcon icon={faEarthAmericas} className='text-title-color dark:text-dark-title-color' />
                ) : (
                  <FontAwesomeIcon icon={faLock} className='text-title-color dark:text-dark-title-color' />
                )}
              </div>
              {post.modifiedAt && <span className='md:ml-2 opacity-60'>Đã chỉnh sửa {modifiedAt}</span>}
            </div>
          </div>
        </div>
        {!detail && !share && <SettingPost post={post} />}
      </div>
      <div className='my-2'>
        <Linkify componentDecorator={linkDecorator}>
          <p className={`mb-4 ${detail ? '' : 'line-clamp-3'} break-all`}>{post.content}</p>
        </Linkify>
        {article && (
          <a href={article.link} target='_blank' rel='noreferrer'>
            <article className='mb-4 rounded-md bg-hover-color dark:bg-dark-hover-color border border-solid border-border-color dark:border-dark-border-color'>
              <LazyLoadImage
                placeholderSrc={loadingImage}
                effect='blur'
                width={'100%'}
                src={article.thumbnail}
                alt={article.title}
                className='w-full max-h-[20rem] object-cover rounded-md rounded-bl-none rounded-br-none'
              />
              <div className='flex flex-col items-start justify-start p-2 break-all'>
                <span className='uppercase text-xs'>{article.siteName}</span>
                <div className='flex flex-col items-start justify-start'>
                  <h3 className='text-16 font-bold'>{article.title}</h3>
                  <p className='line-clamp-1'>{article.description}</p>
                </div>
              </div>
            </article>
          </a>
        )}
        {sharePost && authorSharePost && (
          <PostItem author={authorSharePost} post={sharePost} detail={false} share={true} />
        )}
        {post.images && post.images.length > 0 && (
          <div
            className={`${post.images && post.images.length === 1 ? 'w-full' : 'grid grid-cols-2 gap-2 md:gap-4'} mb-4`}
          >
            {post.images.map((image) => (
              <button onClick={() => (share ? null : handleZoomImage(image.url as string, image.name))} key={image.id}>
                <LazyLoadImage
                  placeholderSrc={loadingImage}
                  effect='blur'
                  width={'100%'}
                  className={`${
                    post.images?.length === 1 ? 'h-80 md:h-[25rem]' : 'h-40 md:h-52'
                  } w-full rounded-md object-cover`}
                  src={image.url}
                  alt={image.name}
                />
              </button>
            ))}
          </div>
        )}
        {zoomImage && (
          <PopupImage src={zoomImage.src} name={zoomImage.name} closed={(isClosed) => handleCloseZoom(isClosed)} />
        )}
        {post.video && post.video.name && (
          <div className='w-full'>
            <video className='rounded-md' src={post.video.url} controls>
              <track src={post.video.url} kind='captions' srcLang='en' label='English' />
            </video>
          </div>
        )}
      </div>
      {!share && (
        <div className='flex items-center justify-around mt-4'>
          <button
            onClick={handleCheckLikedPost() ? handleUnlikePost : handleLikePost}
            className='flex items-center justify-start'
          >
            <FontAwesomeIcon
              icon={faThumbsUp}
              className={`${
                handleCheckLikedPost()
                  ? 'text-primary-color dark:text-dark-primary-color'
                  : 'text-title-color dark:text-dark-title-color'
              } text-20 rounded-full p-2 hover:bg-hover-color dark:hover:bg-dark-hover-color`}
            />
            <span className='ml-2'>{likes.length}</span>
          </button>
          <Link to={`/${author && author.username}/post/${post.id}`}>
            <button className='flex items-center justify-start'>
              <FontAwesomeIcon
                icon={faCommentDots}
                className='text-title-color dark:text-dark-title-color text-20 rounded-full p-2 hover:bg-hover-color dark:hover:bg-dark-hover-color'
              />
              <span className='ml-2'>{detail ? commentList.length : comments.length}</span>
            </button>
          </Link>
          <div className='flex items-center justify-start'>
            <ShareOption post={sharePost ? sharePost : post} author={authorSharePost ? authorSharePost : author} />
            <span className='ml-2'>{shares.length}</span>
          </div>
        </div>
      )}
    </div>
  )
}
