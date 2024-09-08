import Head from 'next/head'
import mainPageStyles from './MainPage.module.css'
import { SearchForm } from '../../components/features/Search/SearchForm'
import Link from 'next/link'
import { Button } from 'flowbite-react'

export default function MainPage() {
  return (
    <>
      <div className={mainPageStyles.container}>
        <h1 className="text-slate-700 text-xl sm:text-4xl md:text-4xl text-center mb-8">
          Сахаджа Йога <br/>
          Лекции Шри Матаджи
        </h1>
        <h2 className="text-slate-600 text-xl sm:text-2xl md:text-3xl text-center font mb-16">
          Библиотека лекций Шри Матаджи Нирмала Деви <br/>
          Поиск по темам и годам
        </h2>
        <div className="mb-4 mt-16">
          <SearchForm/>
        </div>
        <div className="mt-8">
          <Link href="/lections/years">
            <Button outline gradientDuoTone="cyanToBlue">Лекции по годам</Button>
          </Link>
        </div>
      </div>
    </>
  )
}
