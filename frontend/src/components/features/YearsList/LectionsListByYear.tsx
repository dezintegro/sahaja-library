import { useRouter } from 'next/router'
import { useFetchData, usePagination } from '../../../shared/hooks'
import { IPaginatedResponse } from '../../../shared/types'
import { ILection } from '../../../shared/types/lection'
import { LoadingStatus } from '../../common/LoadingStatus/LoadingStatus'
import { LectionList } from '../../common/LectionList/LectionList'
import { Pagination } from 'flowbite-react'
import { FC } from 'react'

export const LectionsByYear: FC = () => {
  const router = useRouter()
  const { id } = router.query
  const { currentPage, setCurrentPage, url, totalPages } = usePagination(`/lections/?year=${id}`)
  const { data, error, isLoading } = useFetchData<IPaginatedResponse<ILection>>(url)

  return (
    <>
      <LoadingStatus isLoading={isLoading} error={error} />
      {data && (
        <>
          <h1 className="text-4xl font-bold text-center mb-8">Лекции Шри Матаджи за {id} год</h1>
          <div>
            <h5 className="secondaryFont">
              {data.count ? `Найдено лекций: ${data.count}` : 'Лекций не найдено'}
            </h5>
          </div>
          {data.count > 0 && <LectionList items={data.results} />}
          <div className="flex overflow-x-auto sm:justify-center">
            <Pagination
              showIcons
              previousLabel={'Назад'}
              nextLabel={'Вперед'}
              currentPage={currentPage}
              totalPages={totalPages(data.count)}
              onPageChange={(number) => setCurrentPage(number)}
            />
          </div>
        </>
      )}
    </>
  )
}
