import { Link, NavLink } from 'react-router-dom'
import userImg from '~/assets/images/user.png'
import { User } from '~/types'

interface Props {
  data: User
}

export default function UserPreview(props: Props) {
  const { data } = props
  return (
    <Link to={`/profile/${data.username}/posts`}>
      <div className='flex items-center justify-start text-14 mb-4 hover:bg-input-color rounded-md cursor-pointer'>
        <img
          loading='lazy'
          src={data.avatar ? data.avatar.url : userImg}
          alt={data.firstName + ' ' + data.lastName}
          className='w-8 h-8 object-cover rounded-md mr-2'
        />
        <span>
          {data.firstName} {data.lastName}
        </span>
      </div>
    </Link>
  )
}
