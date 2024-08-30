import { FC } from 'react'
import cardStyles from '../../ui/LectionCard/LectionCard.module.css'
import lectionStyles from './Lection.module.css'

import { ILection } from '../../../shared/types/lection'

interface LectionViewProps {
  lection: ILection
}

export const LectionView: FC<LectionViewProps> = ({ lection }) => (
  <div className={lectionStyles.container}>
    <h1>{lection.title}</h1>
    <h5 className={cardStyles.subtitle}>
      {lection.city && lection.country ? `${lection.city}, ${lection.country}` : lection.city ?? lection.country}{' '}
      {lection.date ? new Date(lection.date).toLocaleDateString() : null}
    </h5>
    <div className={cardStyles.content}>
      <p dangerouslySetInnerHTML={{ __html: lection.content_ru }}/>
    </div>
  </div>
)
