import { FC } from 'react'

export const CardSkeleton: FC = () => {
  return (
    <div
      role="status"
      className="animate-pulse max-w-sm p-4 border border-gray-200 rounded shadow md:p-6 dark:border-gray-700"
    >
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}
