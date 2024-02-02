import { FC, useState } from 'react'
import { SearchInput } from '../ui/SearchInput'
import { useRouter } from 'next/router'

export const SearchForm: FC = () => {
  const router = useRouter()
  const initialQuery = (router.query.searchQuery ?? '') as string

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const handleChangeValue = (val: string) => {
    setSearchQuery(val)
  }
  const handleSearch = () => {
    searchQuery && router.push(`/search/${searchQuery}`)
    // searchQuery && router.push(`/search/${searchQuery}`, undefined, { shallow: true })
  }

  return <SearchInput value={searchQuery} onChange={handleChangeValue} onSearch={handleSearch} />
}

export default SearchForm
