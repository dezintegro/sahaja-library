import Head from 'next/head'
import mainPageStyles from './MainPage.module.css'
import { SearchForm } from '../../components/Search/SearchForm'
import Link from 'next/link'

export default function MainPage() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={mainPageStyles.container}>
        <SearchForm />
        {/*<Link href="/lections/years">В каталог</Link>*/}
      </div>
    </>
  )
}
