import styles from './YearsList.module.css'
import Link from 'next/link'
import { IPaginatedResponse } from '../../../shared/types/common'
import { useFetchData } from '../../../shared/hooks'
import { LoadingStatus } from '../../common/LoadingStatus/LoadingStatus'
import { YearCard } from './YearsListCard'

export interface IYearMeta {
  count: number
  year: string
}

export default function YearsList() {
  const address = '/lections/years/?page_size=100'
  const { data, error, isLoading } = useFetchData<IPaginatedResponse<IYearMeta>>(address)

  return (
    <div className={styles.container}>
      <LoadingStatus isLoading={isLoading} error={error} />
      {data?.results && (
        <div className={styles.flex}>
          {data.results.map((item: IYearMeta) => (
            <div className={styles.flexItem} key={item.year}>
              <Link href={`/lections/years/${item.year}`}>
                <YearCard title={`${item.year} год`} content={`Лекций: ${item.count}`} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
