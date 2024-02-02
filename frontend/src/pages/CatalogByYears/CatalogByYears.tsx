import YearsList from '../../components/Catalog/YearsList'
import searchResultPageStyles from '../SearchResultPage/SearchResultPage.module.css'

export default function CatalogByYearsPage() {
  return (
    <div className={searchResultPageStyles.container}>
      <YearsList />
    </div>
  )
}
