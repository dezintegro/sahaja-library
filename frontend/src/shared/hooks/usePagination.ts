import { useState } from 'react'
import { PAGE_SIZE } from '../constants'

export const usePagination = (baseUrl: string) => {

  const [currentPage, setCurrentPage] = useState(1)
  const url = `${baseUrl}?page=${currentPage}`

  const totalPages = (count: number) => Math.ceil(count / PAGE_SIZE)

  return { currentPage, setCurrentPage, url, totalPages }
}
