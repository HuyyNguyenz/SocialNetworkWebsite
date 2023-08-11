import Skeleton from 'react-loading-skeleton'

interface Props {
  quantity: number
}

export default function Loading(props: Props) {
  const loadingArray = []
  const { quantity } = props
  for (let i = 0; i < quantity; i++) {
    loadingArray.push(i)
  }

  return (
    <>
      {loadingArray.length > 0 &&
        loadingArray.map((id) => (
          <div key={id} className='flex items-start justify-start w-full py-4 px-8 '>
            <Skeleton circle className='w-8 h-8 mr-4 dark:bg-bg-dark' />
            <Skeleton count={5} className='w-64 md:w-[41rem] dark:bg-bg-dark' />
          </div>
        ))}
    </>
  )
}
