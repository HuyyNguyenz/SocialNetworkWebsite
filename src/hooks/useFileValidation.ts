import { useState } from 'react'
import { FilePreview } from '~/types'

const useFileValidation = (): [
  images: FilePreview[],
  video: FilePreview,
  error: { image: string; video: string },
  handleValidation: (event: React.ChangeEvent<HTMLInputElement>) => void
] => {
  const [images, setImages] = useState<FilePreview[]>([])
  const [video, setVideo] = useState<FilePreview>({ id: '', name: '', src: '' })
  const [error, setError] = useState<{ image: string; video: string }>({ image: '', video: '' })
  const handleValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case 'images':
        if ((event.target.files?.length as number) > 0 && (event.target.files?.length as number) <= 4) {
          const length = event.target.files?.length as number
          const newArray: File[] = []
          const imagePreviewArray: FilePreview[] = []
          for (let index = 0; index < length; index++) {
            if (event.target.files?.item(index)?.type.includes('image')) {
              newArray.push(event.target.files?.item(index) as File)
              setError((prev) => ({ ...prev, image: '' }))
            } else {
              setImages([])
              setError((prev) => ({ ...prev, image: 'Vui lòng chọn file ảnh' }))
            }
          }
          if (newArray.length > 0) {
            newArray.forEach((image, index) => {
              const src = URL.createObjectURL(image)
              imagePreviewArray.push({ id: index + '', name: image.name, src, origin: image })
            })
          }
          setImages(imagePreviewArray)
        } else {
          setImages([])
          setError((prev) => ({ ...prev, image: 'Vui lòng chọn không quá 4 ảnh' }))
        }
        break
      case 'video':
        if (event.target.files?.item(0)?.type.includes('video')) {
          if ((event.target.files?.item(0)?.size as number) < 50000000) {
            const src = URL.createObjectURL(event.target.files?.item(0) as File)
            const name = event.target.files?.item(0)?.name as string
            setVideo({ id: '', name, src, origin: event.target.files?.item(0) as File })
            setError((prev) => ({ ...prev, video: '' }))
          } else {
            setVideo({ id: '', name: '', src: '', origin: undefined })
            setError((prev) => ({ ...prev, video: 'Chỉ được upload file video nhỏ hơn 50mb' }))
          }
        } else {
          setVideo({ id: '', name: '', src: '', origin: undefined })
          setError((prev) => ({ ...prev, video: 'Vui lòng chọn file video' }))
        }
        break
    }
  }
  return [images, video, error, handleValidation]
}

export default useFileValidation
