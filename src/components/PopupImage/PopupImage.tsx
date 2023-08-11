interface Props {
  src: string
  name: string
  closed: (value: boolean) => void
}

export default function PopupImage(props: Props) {
  const { src, name } = props
  return (
    <>
      <div className='animate-fade center fixed z-[60] w-full h-[50%] md:w-[50%] md:h-[70%]'>
        <img src={src} alt={name} className='w-full h-full object-cover' />
      </div>
      <button onClick={() => props.closed(true)}>
        <div className='overlay'></div>
      </button>
    </>
  )
}
