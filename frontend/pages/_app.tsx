import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Suspense } from 'react'
import { Metrika } from '../src/components/Metrika'
import Head from 'next/head'
import SelectableText from '../src/components/Lection/SelectableText'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Suspense>
        <Metrika />
      </Suspense>
      <Head>
        <title>Сахаджа Йога - Библиотека лекций Шри Матаджи Нирмала Деви</title>
        <meta
          name="description"
          content="Сахаджа Библиотека - поиск по лекциям Шри Матаджи Нирмала Деви. Введите запрос и найдите лекции по интересующей теме."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="/og-image.jpg" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SelectableText />

      <Component {...pageProps} />
    </>
  )
}
