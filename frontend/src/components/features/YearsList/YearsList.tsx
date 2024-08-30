import { LectionCard } from '../../ui/LectionCard/LectionCard'
import Link from 'next/link'
import { IPaginatedResponse } from '../../../shared/types/common'
import { useFetchData } from '../../../shared/hooks'
import { LoadingStatus } from '../../common/LoadingStatus/LoadingStatus'

export interface IYearMeta {
  count: number
  year: string
}

export default function YearsList() {
  const address = '/lections/years/?page_size=100'
  const { data, error, isLoading } = useFetchData<IPaginatedResponse<IYearMeta>>(address)

  return (
    <>
      <LoadingStatus isLoading={isLoading} error={error} />
      {data?.results && (
        <>
          {data.results.map((item: IYearMeta) => (
            <Link href={`/lections/?year=${item.year}`} key={item.year}>
              <LectionCard title={`${item.year} год`} content={`Лекций: ${item.count}`} />
            </Link>
          ))}
        </>
      )}
    </>
  )
}
