import SearchResult from '../../components/features/Search/SearchResult'
import { SearchForm } from '../../components/features/Search/SearchForm'
import searchResultPageStyles from './SearchResultPage.module.css'

export default function SearchResultPage() {
  return (
    <div className={searchResultPageStyles.container}>
      <SearchForm />
      <SearchResult />
    </div>
  )
}
