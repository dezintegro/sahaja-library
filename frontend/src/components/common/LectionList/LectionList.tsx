import { FC } from 'react'
import { LectionCard } from '../../ui/LectionCard/LectionCard'
import { ILection } from '../../../shared/types/lection'

interface LectionListProps {
  items: ILection[]
  highlight?: string | string[]
}

export const LectionList: FC<LectionListProps> = ({ items, highlight }) => {
  return (
    <>
      {items.map((item: ILection) => (
        <a href={`/lections/${item.id}${highlight ? `?highlight=${highlight}` : ''}`} key={item.id}>
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
