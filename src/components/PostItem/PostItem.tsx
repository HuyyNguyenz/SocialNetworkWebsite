import { useState, useEffect } from 'react'
import { Comment, FilePreview, Post, User } from '~/types'
import moment from 'moment'
import userImg from '~/assets/images/user.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots, faEarthAmericas, faLock, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import SettingPost from '../SettingPost'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import fetchApi from '~/utils/fetchApi'
import { setCommentList } from '~/features/comment/commentSlice'
import socket from '~/socket'
import { RootState } from '~/store'
import Linkify from 'react-linkify'
import { load } from 'cheerio'

interface Props {
  post: Post
  author: User
  detail: boolean
}

export default function PostItem(props: Props) {
  const { post, author, detail } = props
  const commentList = useSelector((state: RootState) => state.commentList.data)
  const createdAt = moment(post.createdAt, 'DD/MM/YYYY hh:mm').fromNow()
  const modifiedAt = moment(post.modifiedAt, 'DD/MM/YYYY hh:mm').fromNow()
  const [comments, setComments] = useState<Comment[]>([])
  const [article, setArticle] = useState<{
    siteName: string
    title: string
    description: string
    thumbnail: string
    link: string
  }>()
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

  useEffect(() => {
    const controller = new AbortController()
    post &&
      fetchApi
        .get(`commentsPost/${post.id}/0/0`, { signal: controller.signal })
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
          .get(`commentsPost/${post.id}/0/0`, { signal: controller.signal })
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
    post &&
      articleElement &&
      fetchApi
        .get(`article?link=${articleElement.innerText}`, { signal: controller.signal })
        .then((res) => {
          const $ = load(res.data)
          const siteName = $('meta[property="og:site_name"]').attr('content') as string
          const title = $('meta[property="og:title"]').attr('content') as string
          const description = $('meta[property="og:description"]').attr('content') as string
          const thumbnail = $('meta[property="og:image"]').attr('content') as string
          setArticle({ siteName, title, description, thumbnail, link: articleElement.innerText })
        })
        .catch((error) => error.name !== 'CanceledError' && console.log(error))
    return () => {
      controller.abort()
    }
  }, [post])

  return (
    <div
      className={`w-full px-8 py-4 bg-bg-light dark:bg-bg-dark rounded-md text-14 text-text-color dark:text-dark-text-color border border-solid border-border-color dark:border-dark-border-color ${
        detail ? 'rounded-br-none rounded-bl-none mt-8' : 'mb-8'
      }`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-start'>
          <Link to={`/${author && author.username}/profile/${author && author.id}/posts`}>
            <img
              loading='lazy'
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
            <div className='flex items-center justify-start'>
              <span className='mr-2'>{createdAt}</span>
              {post.type === 'public' ? (
                <FontAwesomeIcon icon={faEarthAmericas} className='text-title-color dark:text-dark-title-color' />
              ) : (
                <FontAwesomeIcon icon={faLock} className='text-title-color dark:text-dark-title-color' />
              )}
              {post.modifiedAt && <span className='ml-2 opacity-60'>Đã chỉnh sửa {modifiedAt}</span>}
            </div>
          </div>
        </div>
        {!detail && <SettingPost post={post} />}
      </div>
      <div className='my-2'>
        <Linkify componentDecorator={linkDecorator}>
          <p className={`mb-4 ${detail ? '' : 'line-clamp-3'} break-all`}>{post.content}</p>
        </Linkify>
        {article && (
          <a href={article.link} target='_blank' rel='noreferrer'>
            <article className='mb-4 rounded-md bg-hover-color dark:bg-dark-hover-color border border-solid border-border-color dark:border-dark-border-color'>
              <img
                src={article.thumbnail}
                alt={article.title}
                className='w-full max-h-[20rem] object-cover rounded-md rounded-bl-none rounded-br-none'
              />
              <div className='flex flex-col items-start justify-start p-2'>
                <span className='uppercase text-xs'>{article.siteName}</span>
                <div className='flex flex-col items-start justify-start'>
                  <h3 className='text-16 font-bold'>{article.title}</h3>
                  <p className='line-clamp-1'>{article.description}</p>
                </div>
              </div>
            </article>
          </a>
        )}
        <div className={`${post.images?.length === 1 ? 'w-full' : 'grid grid-cols-2 gap-4'} mb-4`}>
          {(post.images as FilePreview[]).length > 0 &&
            post.images?.map((image, index) => (
              <img
                loading='lazy'
                key={index}
                className={`${post.images?.length === 1 ? 'h-[25rem]' : 'h-52'} w-full rounded-md object-cover`}
                src={image.url}
                alt={image.name}
              />
            ))}
        </div>

        {post.video?.name && (
          <div className='w-full'>
            <video className='rounded-md' src={post.video?.url} controls>
              <track src={post.video?.url} kind='captions' srcLang='en' label='English' />
            </video>
          </div>
        )}
      </div>
      <div className='flex items-center justify-around mt-4'>
        <button className='flex items-center justify-start'>
          <FontAwesomeIcon
            icon={faThumbsUp}
            className='text-title-color dark:text-dark-title-color text-20 rounded-full p-2 hover:bg-hover-color dark:hover:bg-dark-hover-color'
          />
          <span className='ml-2'>0</span>
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
        <button className='flex items-center justify-start'>
          <FontAwesomeIcon
            icon={faShare}
            className='text-title-color dark:text-dark-title-color text-20 rounded-full p-2 hover:bg-hover-color dark:hover:bg-dark-hover-color'
          />
          <span className='ml-2'>0</span>
        </button>
      </div>
    </div>
  )
}
