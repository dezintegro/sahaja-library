import SearchResult from '../../components/Search/SearchResult'
import { SearchForm } from '../../components/Search/SearchForm'
import searchResultPageStyles from './SearchResultPage.module.css'

export default function SearchResultPage() {
  return (
    <div className={searchResultPageStyles.container}>
      <SearchForm />
      <SearchResult />
    </div>
  )
}
