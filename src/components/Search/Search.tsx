import { faArrowLeft, faSearch, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react/headless'
import { useState, useEffect } from 'react'
import useDebounce from '~/hooks/useDebounce'
import UserPreview from '../UserPreview'
import fetchApi from '~/utils/fetchApi'
import { User } from '~/types'

interface Props {
  hidden: (value: boolean) => void
}

export default function Search(props: Props) {
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchData, setSearchData] = useState<User[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [isShowInput, setShowInput] = useState<boolean>(false)
  const debounceValue = useDebounce(searchValue)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue((prev) => (prev !== '' ? event.target.value : event.target.value.trim()))
  }

  const handleClearText = () => {
    const searchInput = document.getElementById('search')
    searchInput?.focus()
    setSearchValue('')
  }

  useEffect(() => {
    if (debounceValue.length > 0) {
      setLoading(true)
      const controller = new AbortController()
      const loading = setTimeout(() => {
        const getData = async () => {
          try {
            const result = (
              await fetchApi.get(`search?value=${debounceValue}&limit=10&page=1`, { signal: controller.signal })
            ).data
            setSearchData(result)
          } catch (error: any) {
            error.name !== 'CanceledError' && console.log(error)
          }
        }
        getData()
        setLoading(false)
      }, 700)

      return () => {
        clearTimeout(loading)
        controller.abort()
      }
    } else {
      setSearchData([])
    }
  }, [debounceValue])

  return (
    <div className='ml-4 flex flex-row-reverse items-center justify-start'>
      {isShowInput && (
        <div>
          <Tippy
            onClickOutside={() => setVisible(false)}
            visible={visible && searchValue.length > 0}
            interactive
            render={(attrs) => (
              <div className='overflow-hidden shadow-lg rounded-md animate-fade' tabIndex={-1} {...attrs}>
                <div
                  className={`flex flex-col items-start justify-start scrollbar w-72 md:w-80 text-14 p-2 bg-bg-light dark:bg-bg-dark border border-solid border-border-color dark:border-dark-border-color min-h-[6.25rem] max-h-[25rem] overflow-y-auto`}
                >
                  <h2 className='text-title-color dark:text-dark-title-color font-semibold mb-2'>
                    Kết quả tìm kiếm {`'${searchValue}'`}
                  </h2>
                  {searchData.length > 0 ? (
                    searchData.map((data) => (
                      <button className='w-full' onClick={() => setVisible(false)} key={data.id}>
                        <UserPreview data={data} />
                      </button>
                    ))
                  ) : (
                    <span className='dark:text-dark-text-color'>Không tìm thấy</span>
                  )}
                </div>
              </div>
            )}
          >
            <div
              className={`h-9 flex w-72 md:w-80 items-center justify-start text-text-color dark:text-dark-text-color text-14 rounded-md border border-solid border-border-color dark:border-dark-border-color bg-input-color dark:bg-dark-input-color overflow-hidden`}
            >
              <FontAwesomeIcon icon={faSearch} className='px-4' />
              <input
                onFocus={() => setVisible(true)}
                type='text'
                name='search'
                id='search'
                placeholder='Tìm kiếm ...'
                spellCheck={false}
                className='w-full h-full py-2 bg-input-color dark:bg-dark-input-color outline-none'
                onChange={handleChange}
                value={searchValue}
              />
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} className='px-4 animate-spin' />
              ) : (
                searchValue.length > 0 && (
                  <FontAwesomeIcon icon={faTimes} className='px-4 cursor-pointer' onClick={handleClearText} />
                )
              )}
            </div>
          </Tippy>
        </div>
      )}
      <div>
        {isShowInput ? (
          <button
            onClick={() => {
              setShowInput(false)
              props.hidden(false)
            }}
            className='text-title-color dark:text-dark-title-color mr-4 outline-none'
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        ) : (
          <button
            onClick={() => {
              setShowInput(true)
              props.hidden(true)
            }}
            className='text-title-color dark:text-dark-title-color outline-none'
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        )}
      </div>
    </div>
  )
}
