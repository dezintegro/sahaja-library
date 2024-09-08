import { ChangeEvent, FC, KeyboardEvent } from 'react'
import searchStyles from './SearchInput.module.css'

export interface ISearchInputProps {
  value: string
  onChange: (val: string) => void
  onSearch: () => void
}

export const SearchInput: FC<ISearchInputProps> = ({ value, onChange, onSearch }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.value)
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch()
    }
  }
  return (
    <div className={searchStyles.searchContainer}>
      <input
        className={`${searchStyles.search} `}
        name="searchQuery"
        autoFocus
        autoComplete="off"
        type="text"
        placeholder="Введите тему, дату или слова из лекции"
        value={value}
        onChange={(event) => handleChange(event)}
        onKeyDown={handleKeyDown}
      />
      <button className={searchStyles.btnGrad} onClick={onSearch}>
        Найти
      </button>
    </div>
  )
}
