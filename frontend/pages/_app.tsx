import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Suspense } from 'react'
import { Metrika } from '../src/components/common/Metrika'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Suspense>
        <Metrika />
      </Suspense>
      <Head>
        <title>Лекции Шри Матаджи Нирмала Деви | Сахаджа Йога</title>
        <meta
          name="description"
          content="Познавайте Сахаджа Йгоу через лекции Шри Матаджи.
          Библиотека лекций от основательницы Сахаджа Йоги.
          Поиск по тексатм и датам лекций."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="/og-image.jpg" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
