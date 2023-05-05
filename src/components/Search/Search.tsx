import { faSearch, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react/headless'
import { useState, useEffect } from 'react'
import useDebounce from '~/hooks/useDebounce'
import SectionPreview from '../SectionPreview'

const data = {
  avatar:
    'https://scontent.fsgn5-15.fna.fbcdn.net/v/t39.30808-1/313098022_1067778310586156_8504627334683099446_n.jpg?stp=cp0_dst-jpg_p80x80&_nc_cat=108&ccb=1-7&_nc_sid=7206a8&_nc_ohc=B3zLGM1jW60AX-iM6QX&_nc_ht=scontent.fsgn5-15.fna&oh=00_AfDFN_mUYH8q0G9nRniqfrQLE0o7bs-l1jBI92xqt2sbUQ&oe=645966BB',
  firstName: 'Nguyễn Quang',
  lastName: 'Huy'
}

export default function Search() {
  const [searchValue, setSearchValue] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)
  const debounceValue = useDebounce(searchValue)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue((prev) => (prev !== '' ? event.target.value : event.target.value.trim()))
  }

  const handleClearText = () => {
    setSearchValue('')
  }

  return (
    <div>
      <Tippy
        onClickOutside={() => setVisible(false)}
        visible={visible}
        interactive
        render={(attrs) => (
          <div className='overflow-hidden shadow-lg rounded-md animate-fade' tabIndex={-1} {...attrs}>
            <div className='w-[25rem] text-14 p-2 bg-white border border-solid border-border-color min-h-[6.25rem] max-h-[25rem] overflow-y-scroll'>
              <h2 className='text-title-color font-semibold mb-2'>Kết quả tìm kiếm {`'${searchValue}'`}</h2>
              <SectionPreview data={data} />
              <SectionPreview data={data} />
              <SectionPreview data={data} />
              <SectionPreview data={data} />
              <SectionPreview data={data} />
              <SectionPreview data={data} />
              <SectionPreview data={data} />
              <SectionPreview data={data} />
            </div>
          </div>
        )}
      >
        <div className='w-[25rem] h-9 flex items-center justify-start text-text-color text-14 rounded-md border border-solid border-border-input-color bg-bg-input-color overflow-hidden'>
          <FontAwesomeIcon icon={faSearch} className='px-4' />
          <input
            onFocus={() => setVisible(true)}
            type='text'
            name='search'
            id='search'
            placeholder='Tìm kiếm bạn bè...'
            className='w-full h-full py-2 bg-bg-input-color outline-none'
            onChange={handleChange}
            value={searchValue}
          />
          {searchValue.length > 1 && (
            <FontAwesomeIcon icon={faTimes} className='px-4 cursor-pointer' onClick={handleClearText} />
          )}
          {/* <FontAwesomeIcon icon={faSpinner} className='px-4 animate-spin' /> */}
        </div>
      </Tippy>
    </div>
  )
}
