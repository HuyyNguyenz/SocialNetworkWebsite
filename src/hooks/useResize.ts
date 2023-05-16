import { useEffect, useState } from 'react'

const useResize = () => {
  const [isMobileTablet, setMobileTablet] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = () => {
      if (document.body.clientWidth < 1024) {
        setMobileTablet(true)
      } else {
        setMobileTablet(false)
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobileTablet
}

export default useResize
