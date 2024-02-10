import useSWR from 'swr'
import axios from 'axios'
import { useRouter } from 'next/router'
import { LectionCard } from '../ui/LectionCard/LectionCard'
import { API_URL, PAGE_SIZE } from '../../shared/constants'
import searchResultStyles from './SearchResult.module.css'
import { Pagination } from 'flowbite-react'
import { useState } from 'react'

export interface ISearchResultItem {
  id: number
  title: string
  date: string
  content_ru: string
  city?: string
  country?: string
}

export interface IPaginatedResponse<T> {
  count: number
  next: string
  previous: string
  results: T[]
}

export default function SearchResult() {
  const fetcher = async (url: string) => {
    const response = await axios.get<IPaginatedResponse<ISearchResultItem>>(url)
    return response.data
  }

  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const query = router.query.searchQuery
  const url = `${API_URL}/lections/search/${query}/?page=${currentPage}`

  const { data, error, isLoading } = useSWR(query ? url : null, fetcher)

  if (error) {
    console.error(error)
    return <p>Loading failed...</p>
  }

  if (isLoading) return <h1>Loading...</h1>

  const hasResults = data && data.count
  return (
    <>
      <div className={searchResultStyles.annotationBlock}>
        <h5 className="secondaryFont">{hasResults ? `Найдено записей: ${data.count} ` : 'Ничего не найдено'}</h5>
      </div>
      {hasResults &&
        data.results.map((item: ISearchResultItem) => (
          <a target="_blank" rel="noopener noreferrer" href={`/lections/${item.id}?highlight=${query}`} key={item.id}>
            <LectionCard
              title={item.title}
              content={item.content_ru + '...'}
              date={new Date(item.date)}
              city={item.city}
              country={item.country}
            />
          </a>
        ))}
      <div className="flex overflow-x-auto sm:justify-center">
        <Pagination
          showIcons
          previousLabel={'Назад'}
          nextLabel={'Вперед'}
          currentPage={currentPage}
          totalPages={hasResults ? Math.ceil(data.count / PAGE_SIZE) : 0}
          onPageChange={(number) => setCurrentPage(number)}
        />
      </div>
    </>
  )
}
