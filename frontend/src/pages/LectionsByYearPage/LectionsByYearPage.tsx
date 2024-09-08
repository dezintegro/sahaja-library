import { NextPage } from 'next'
import { LectionsByYear } from '../../components/features/YearsList/LectionsListByYear'

const LectionsByYearPage: NextPage = () => {
  return (
    <div className="container">
      <LectionsByYear />
    </div>
  )
}

export default LectionsByYearPage
