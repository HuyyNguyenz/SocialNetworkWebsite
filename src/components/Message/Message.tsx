import { useState, useEffect } from 'react'
import moment from 'moment'
import { Message, User } from '~/types'
import userImg from '~/assets/images/user.png'
import SettingComment from '~/components/SettingComment'
import { RootState } from '~/store'
import { useSelector } from 'react-redux'
import Linkify from 'react-linkify'
import { load } from 'cheerio'
import fetchApi from '~/utils/fetchApi'

interface Props {
  message: Message
  userFriend: User
}

export default function Message(props: Props) {
  const { message, userFriend } = props
  const createdAt = moment(message.createdAt, 'DD/MM/YYYY hh:mm').fromNow()
  const modifiedAt = message.modifiedAt && moment(message.modifiedAt, 'DD/MM/YYYY hh:mm').fromNow()
  const userData = useSelector((state: RootState) => state.userData)
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
        className={`article-${message.id}`}
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
    const articleElement = document.querySelector(`.article-${message.id}`) as HTMLAnchorElement
    message &&
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
  }, [message])

  return (
    <div
      key={message.id}
      className={`flex ${message.userId === userData.id ? 'flex-row-reverse' : ''} items-start justify-start p-4`}
    >
      <img
        className='w-8 h-8 object-cover rounded-md'
        src={
          message.userId === userData.id
            ? userData.avatar
              ? userData.avatar.url
              : userImg
            : userFriend.avatar
            ? userFriend.avatar.url
            : userImg
        }
        alt={
          message.userId === userData.id
            ? userData.firstName + ' ' + userData.lastName
            : userFriend.firstName + ' ' + userFriend.lastName
        }
      />
      <div
        className={`flex flex-col ${
          message.userId === userData.id ? 'items-end justify-end mr-2' : 'items-start justify-start ml-2'
        } max-w-[60%]`}
      >
        {message.content !== '' && (
          <Linkify componentDecorator={linkDecorator}>
            <p className='border border-solid border-border-color dark:border-dark-border-color rounded-md bg-input-color dark:bg-dark-input-color p-2'>
              {message.deleted === 1 ? <span className='opacity-60'>Tin nhắn này đã bị gỡ</span> : message.content}
            </p>
          </Linkify>
        )}
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
        {message.images && message.deleted === 0 && (
          <div className='mt-4 w-[16rem] h-[16rem]'>
            <img
              loading='lazy'
              className='rounded-md object-cover w-full h-full'
              src={message.images[0].url}
              alt={message.images[0].name}
            />
          </div>
        )}
        {message.video?.name && message.deleted === 0 && (
          <div className='mt-4 w-full'>
            <video className='rounded-md w-full h-full' src={message.video.url} controls>
              <track src={message.video.url} kind='captions' srcLang='en' label='English' />
            </video>
          </div>
        )}
        <div className='flex flex-row-reverse items-start justify-start'>
          <span className='text-xs mt-2'>{message.modifiedAt ? `đã chỉnh sửa ${modifiedAt}` : createdAt}</span>
          {message.userId === userData.id && message.deleted === 0 && <SettingComment message={message} />}
        </div>
      </div>
    </div>
  )
}
