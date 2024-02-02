import cardStyles from './LectionCard.module.css'
import { FC } from 'react'

export interface ILectionCard {
  content: string
  title: string
  city?: string
  country?: string
  date?: Date
}

export const LectionCard: FC<ILectionCard> = ({ title, content, city, country, date }) => {
  return (
    <div className={cardStyles.card}>
      <div className={cardStyles.container}>
        <h3>
          <b>{title}</b>
        </h3>
        <h5 className={cardStyles.subtitle}>
          {city && country ? `${city}, ${country}` : city ?? country} {date ? date.toLocaleDateString() : null}
        </h5>
        <div className={cardStyles.content}>
          <p dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  )
}
