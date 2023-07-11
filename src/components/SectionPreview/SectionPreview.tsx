import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FilePreview } from '~/types'

interface Props {
  data: FilePreview[] | FilePreview
  deleteItem: (id: string) => void
  chatUserId?: number
}

export default function SectionPreview(props: Props) {
  const { data, chatUserId } = props

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
              className={`${
                (data as FilePreview[]).length === 1
                  ? `${chatUserId ? 'w-40 h-w-40' : 'w-full h-[20rem]'} relative`
                  : 'w-full h-52 relative'
              }`}
            >
              <img
                loading='lazy'
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
        <div className={`${chatUserId ? 'w-[40%]' : 'w-full'} relative overflow-hidden`}>
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
