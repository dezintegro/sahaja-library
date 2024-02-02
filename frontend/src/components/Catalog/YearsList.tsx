import useSWR from 'swr'
import axios from 'axios'
import { LectionCard } from '../ui/LectionCard/LectionCard'
import { API_URL } from '../../shared/constants'
import Link from 'next/link'

export interface IYearMeta {
  count: number
  year: string
}

export default function YearsList() {
  const address = `${API_URL}/lections/years/`
  const fetcher = async (url: string) => await axios.get<IYearMeta[]>(url).then((res) => res.data)
  const { data, error, isLoading } = useSWR(address, fetcher)

  if (error) {
    console.error(error)
    return <p>Loading failed...</p>
  }
  if (isLoading) return <h1>Loading...</h1>

  return (
    <>
      {data &&
        data.map((item: IYearMeta) => (
          <Link href={`/lections/?year=${item.year}`} key={item.year}>
            <LectionCard title={`${item.year} год`} content={`Лекций: ${item.count}`} />
          </Link>
        ))}
    </>
  )
}
