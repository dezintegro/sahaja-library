import useSWR from 'swr'
import axios from 'axios'
import { useRouter } from 'next/router'
import { LectionCard } from '../ui/LectionCard/LectionCard'
import { API_URL } from '../../shared/constants'
import searchResultStyles from './SearchResult.module.css'

export interface ISearchResultItem {
  id: number
  title: string
  date: string
  content_ru: string
  city?: string
  country?: string
}

export default function SearchResult() {
  const router = useRouter()
  const query = router.query.searchQuery

  const fetcher = async (query: string) => {
    if (!query) {
      console.log('Empty query')
      return
    }
    const url = `${API_URL}/lections/search/${query}/`
    const response = await axios.get<ISearchResultItem[]>(url)
    return response.data
  }

  const { data, error, isLoading } = useSWR(query, fetcher)

  if (error) {
    console.error(error)
    return <p>Loading failed...</p>
  }
  if (isLoading) return <h1>Loading...</h1>

  return (
    <>
      <div className={searchResultStyles.annotationBlock}>
        <h5 className="secondaryFont">{data ? `Найдено записей: ${data.length} ` : 'Ничего не найдено'}</h5>
      </div>
      {data &&
        data.map((item: ISearchResultItem) => (
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
    </>
  )
}
