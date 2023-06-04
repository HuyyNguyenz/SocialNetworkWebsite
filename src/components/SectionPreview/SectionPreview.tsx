import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'
import { FilePreview } from '~/types'

interface Props {
  data: FilePreview[] | FilePreview
  deleteItem: (id: string) => void
}

export default function SectionPreview(props: Props) {
  const { data } = props

  const handleDelete = (id: string) => {
    props.deleteItem(id)
  }

  return (
    <div
      className={`${
        (data as FilePreview[]).length === 1 || (data as FilePreview).name ? 'my-2' : 'grid grid-cols-2 gap-4 my-2'
      }`}
    >
      {(data as FilePreview[]).length > 0 &&
        (data as FilePreview[]).map((image) => {
          return (
            <div
              key={image.id}
              className={`${(data as FilePreview[]).length === 1 ? 'w-full h-[20rem] relative' : 'w-80 h-52 relative'}`}
            >
              <img
                src={image.src ? image.src : image.url}
                alt={image.name}
                className='rounded-md w-full h-full object-cover'
              />
              <button onClick={() => handleDelete(image.id)}>
                <FontAwesomeIcon
                  icon={faTimes}
                  className='bg-black p-2 text-white text-14 rounded-full absolute top-2 left-2 cursor-pointer hover:opacity-80'
                />
              </button>
            </div>
          )
        })}
      {(data as FilePreview).name && (
        <div className='w-full h-[25rem] relative overflow-hidden'>
          <video
            src={(data as FilePreview).src ? (data as FilePreview).src : (data as FilePreview).url}
            controls
            className='rounded-md'
          >
            <track
              src={(data as FilePreview).src ? (data as FilePreview).src : (data as FilePreview).url}
              kind='captions'
              srcLang='en'
              label='English'
            />
          </video>
          <button onClick={() => handleDelete((data as FilePreview).id)}>
            <FontAwesomeIcon
              icon={faTimes}
              className='bg-black p-2 text-white text-14 rounded-full absolute top-2 left-2 cursor-pointer hover:opacity-80'
            />
          </button>
        </div>
      )}
    </div>
  )
}
