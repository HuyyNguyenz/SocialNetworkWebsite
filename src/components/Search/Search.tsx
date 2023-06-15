import { faSearch, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react/headless'
import { useState, useEffect } from 'react'
import useDebounce from '~/hooks/useDebounce'
import UserPreview from '../UserPreview'
import fetchApi from '~/utils/fetchApi'
import { User } from '~/types'

export default function Search() {
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchData, setSearchData] = useState<User[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
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
      const { signal } = controller
      const loading = setTimeout(() => {
        const getData = async () => {
          try {
            const result = (await fetchApi.post('search', { searchValue: debounceValue }, { signal })).data
            setSearchData(result)
          } catch (error: any) {
            throw error.response
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
    <div>
      <Tippy
        onClickOutside={() => setVisible(false)}
        visible={visible && searchValue.length > 0}
        interactive
        render={(attrs) => (
          <div className='overflow-hidden shadow-lg rounded-md animate-fade' tabIndex={-1} {...attrs}>
            <div className='w-[26.5rem] text-14 p-2 bg-white border border-solid border-border-color min-h-[6.25rem] max-h-[25rem] overflow-y-scroll'>
              <h2 className='text-title-color font-semibold mb-2'>Kết quả tìm kiếm {`'${searchValue}'`}</h2>
              {searchData.length > 0 ? (
                searchData.map((data) => <UserPreview key={data.id} data={data} />)
              ) : (
                <span>Không tìm thấy</span>
              )}
            </div>
          </div>
        )}
      >
        <div className='w-[26.5rem] h-9 flex ml-[5.25rem] items-center justify-start text-text-color text-14 rounded-md border border-solid border-border-color bg-input-color overflow-hidden'>
          <FontAwesomeIcon icon={faSearch} className='px-4' />
          <input
            onFocus={() => setVisible(true)}
            type='text'
            name='search'
            id='search'
            placeholder='Tìm kiếm bạn bè...'
            spellCheck={false}
            className='w-full h-full py-2 bg-input-color outline-none'
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
  )
}
