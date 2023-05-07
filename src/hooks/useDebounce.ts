import { useState, useEffect } from 'react'

const useDebounce = (value: string) => {
  const [debounceValue, setDebounceValue] = useState<string>('')

  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebounceValue(value)
    }, 700)

    return () => {
      clearTimeout(debounce)
    }
  }, [value])

  return debounceValue
}

export default useDebounce
