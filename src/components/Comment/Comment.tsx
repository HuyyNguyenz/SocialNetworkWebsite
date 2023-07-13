import { useEffect, useState } from 'react'
import { faCrown, faReply, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import userImg from '~/assets/images/user.png'
import { Comment, User } from '~/types'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import SettingComment from '../SettingComment'
import { Link } from 'react-router-dom'
import fetchApi from '~/utils/fetchApi'
import Linkify from 'react-linkify'
import { load } from 'cheerio'

interface Props {
  comment: Comment
  author: User
  authorPostId: number
}

export default function Comment(props: Props) {
  const { comment, author, authorPostId } = props
  const userData = useSelector((state: RootState) => state.userData)
  const createdAt = moment(comment.createdAt, 'DD/MM/YYYY hh:mm').fromNow()
  const modifiedAt = moment(comment.modifiedAt, 'DD/MM/YYYY hh:mm').fromNow()
  const [article, setArticle] = useState<{
    siteName: string
    title: string
    description: string
    thumbnail: string
    link: string
  }>()

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank')
  }

  const linkDecorator = (href: string, text: string, key: any) => {
    return (
      <a
        className={`article-${comment.id}`}
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
    window.scrollTo(0, document.body.scrollHeight)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const articleElement = document.querySelector(`.article-${comment.id}`) as HTMLAnchorElement
    comment &&
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
  }, [comment])

  return (
    <div className={`my-4 ${comment.deleted === 1 && 'opacity-60'}`}>
      <div className='flex items-start justify-start'>
        <Link to={`/${author.username}/profile/${author.id}/posts`}>
          <img
            loading='lazy'
            src={author.avatar ? author.avatar.url : userImg}
            alt={author.firstName + ' ' + author.lastName}
            className='w-8 h-8 object-cover rounded-md'
          />
        </Link>
        <div className='ml-4'>
          <div className='flex flex-col items-start justify-start bg-input-color dark:bg-dark-input-color rounded-md border border-solid border-border-color dark:border-dark-border-color py-2 px-4'>
            <div className='mb-1 flex items-center justify-start'>
              <Link to={`/${author.username}/profile/${author.id}/posts`}>
                <span className='text-primary-color dark:text-dark-primary-color font-bold'>
                  {author.firstName} {author.lastName}
                </span>
              </Link>
              {author.id === authorPostId && <FontAwesomeIcon icon={faCrown} className='ml-2 text-crown-color' />}
              <span className='ml-2 text-xs'>{createdAt}</span>
              {comment.modifiedAt && <span className='ml-2 opacity-60 text-xs'>| Đã chỉnh sửa {modifiedAt}</span>}
            </div>
            {comment.deleted === 0 ? (
              <Linkify componentDecorator={linkDecorator}>
                <p className='break-all mb-4'>{comment.content}</p>
              </Linkify>
            ) : (
              <del className='dark:text-dark-text-color'>Bình luận này đã bị ẩn</del>
            )}
            {article && (
              <a href={article.link} target='_blank' rel='noreferrer'>
                <article className='mb-4 w-[20rem] rounded-md bg-hover-color dark:bg-dark-hover-color border border-solid border-border-color dark:border-dark-border-color'>
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
          </div>
          {comment.images && comment.deleted === 0 && (
            <div className='mt-4 w-[16rem] h-[16rem]'>
              <img
                loading='lazy'
                className='rounded-md object-cover w-full h-full'
                src={comment.images[0].url}
                alt={comment.images[0].name}
              />
            </div>
          )}
          {comment.video?.name && comment.deleted === 0 && (
            <div className='mt-4 w-[26rem]'>
              <video className='rounded-md w-full h-full' src={comment.video.url} controls>
                <track src={comment.video.url} kind='captions' srcLang='en' label='English' />
              </video>
            </div>
          )}
          {comment.deleted === 0 && (
            <div className='flex items-center justify-start py-2 px-4 text-16'>
              <button className='flex items-center justify-start mr-8'>
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  className='hover:bg-hover-color dark:hover:bg-dark-hover-color rounded-full p-2'
                />
                <span className='ml-2 text-14'>0</span>
              </button>
              <button className='flex items-center justify-start mr-8'>
                <FontAwesomeIcon
                  icon={faReply}
                  className='hover:bg-hover-color dark:hover:bg-dark-hover-color rounded-full p-2'
                />
                <span className='ml-2 text-14'>0</span>
              </button>
              {userData.id === comment.userId && <SettingComment comment={comment} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
