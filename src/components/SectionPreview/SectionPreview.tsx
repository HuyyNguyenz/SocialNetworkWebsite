import React from 'react'

interface Props {
  data: {
    avatar: string
    firstName: string
    lastName: string
  }
}

export default function SectionPreview(props: Props) {
  const { data } = props
  return (
    <div className='flex items-center justify-start text-14 mb-4 hover:bg-bg-input-color rounded-md cursor-pointer'>
      <img src={data.avatar} alt='user_avatar' className='w-9 h-9 object-cover rounded-full mr-2' />
      <span>
        {data.firstName} {data.lastName}
      </span>
    </div>
  )
}
