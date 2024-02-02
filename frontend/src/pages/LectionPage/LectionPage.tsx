import lectionPageStyles from './LectionPage.module.css'
import { Lection } from '../../components/Lection/Lection'

export default function LectionPage() {
  return (
    <div className={lectionPageStyles.container}>
      <Lection />
    </div>
  )
}
