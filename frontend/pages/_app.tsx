import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Suspense } from 'react'
import { Metrika } from '../src/components/Metrika'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Suspense>
        <Metrika />
      </Suspense>
      <Component {...pageProps} />
    </>
  )
}
