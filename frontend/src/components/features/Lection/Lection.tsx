import { FC } from 'react'
import { useRouter } from 'next/router'
import cardStyles from '../../ui/LectionCard/LectionCard.module.css'
import lectionStyles from './Lection.module.css'
import { useFetchData } from '../../../shared/hooks/useFetch'
import { LoadingStatus } from '../../common/LoadingStatus/LoadingStatus'
import { LectionView } from './LectionView'
import { ILection } from '../../../shared/types/lection'


export const Lection: FC = () => {
  const router = useRouter()
  const { id, highlight } = router.query
  const address = id && `/lections/${id}/?highlight=${highlight}`

  const { data, error, isLoading } = useFetchData<ILection>(address)

  return (
    <>
      <LoadingStatus isLoading={isLoading} error={error}/>
      {data && <LectionView lection={data} />}
    </>
  )
}
