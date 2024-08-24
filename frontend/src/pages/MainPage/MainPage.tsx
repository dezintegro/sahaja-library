import Head from 'next/head'
import mainPageStyles from './MainPage.module.css'
import { SearchForm } from '../../components/Search/SearchForm'
import Link from 'next/link'

export default function MainPage() {
  return (
    <>
      <div className={mainPageStyles.container}>
        <SearchForm />
        {/*<Link href="/lections/years">В каталог</Link>*/}
      </div>
    </>
  )
}
