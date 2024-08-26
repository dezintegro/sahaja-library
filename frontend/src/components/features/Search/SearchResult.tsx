import { useFetchData, usePagination } from '../../../shared/hooks'
import { API_URL } from '../../../shared/constants'
import { IPaginatedResponse } from '../../../shared/types'
import { LoadingStatus } from '../../common/LoadingStatus/LoadingStatus'
import { LectionList } from '../../common/LectionList/LectionList'
import { Pagination } from 'flowbite-react'
import searchResultStyles from './SearchResult.module.css'
import { ILection } from '../../../shared/types/lection'
import { useRouter } from 'next/router'


export default function SearchResult() {
  const router = useRouter()
  const query = router.query.searchQuery
  const { currentPage, setCurrentPage, url, totalPages } = usePagination(`/lections/search/${query}`)
  const { data, error, isLoading } = useFetchData<IPaginatedResponse<ILection>>(url)

  return (
    <>
      <LoadingStatus isLoading={isLoading} error={error} />
      {data && (
        <>
          <div className={searchResultStyles.annotationBlock}>
            <h5 className="secondaryFont">
              {data.count ? `Найдено записей: ${data.count}` : 'Ничего не найдено'}
            </h5>
          </div>
          {data.count > 0 && <LectionList items={data.results} highlight={query} />}
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
