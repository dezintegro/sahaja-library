import lectionPageStyles from './LectionPage.module.css'
import { Lection } from '../../components/features/Lection/Lection'

export default function LectionPage() {
  return (
    <div className={lectionPageStyles.container}>
      <Lection />
    </div>
  )
}
