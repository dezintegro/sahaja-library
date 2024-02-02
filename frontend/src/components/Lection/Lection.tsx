import { FC } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import useSWR from 'swr'
import { API_URL } from '../../shared/constants'
import cardStyles from '../ui/LectionCard/LectionCard.module.css'
import lectionStyles from './Lection.module.css'

export interface ILection {
  id: number
  content_ru: string
  title: string
  city?: string
  country?: string
  date?: Date
  highlightCount: number
}

export const Lection: FC = () => {
  const router = useRouter()
  const { id, highlight } = router.query
  console.log(router.query)
  const address = `${API_URL}/lections/${id}/?highlight=${highlight}`
  console.log('Lection address', address)

  const fetcher = async (url: string): Promise<ILection> => await axios.get(url).then((res) => res.data)
  const { data, error } = useSWR(address, fetcher)

  if (error) {
    return <p>Loading failed...</p>
  }
  if (!data) {
    return <h1>Loading...</h1>
  }

  return (
    <div className={lectionStyles.container}>
      <h1>{data.title}</h1>
      <h5 className={cardStyles.subtitle}>
        {data.city && data.country ? `${data.city}, ${data.country}` : data.city ?? data.country}{' '}
        {data.date ? new Date(data.date).toLocaleDateString() : null}
      </h5>
      <div className={cardStyles.content}>
        <p dangerouslySetInnerHTML={{ __html: data.content_ru }} />
      </div>
    </div>
  )
}
