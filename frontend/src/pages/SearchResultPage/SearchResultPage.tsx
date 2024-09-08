import SearchResult from '../../components/features/Search/SearchResult'
import { SearchForm } from '../../components/features/Search/SearchForm'

export default function SearchResultPage() {
  return (
    <div className="container">
      <SearchForm />
      <SearchResult />
    </div>
  )
}
