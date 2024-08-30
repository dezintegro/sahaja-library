import React from 'react'
import { Spinner } from '../../ui/Spinner'

interface StatusMessageProps {
  isLoading: boolean
  error: any
}

export const LoadingStatus: React.FC<StatusMessageProps> = ({ isLoading, error }) => {
  if (error) {
    return <p>Loading failed...</p>
  }

  if (isLoading)
    return (
      <div className="mt-4">
        <Spinner />
      </div>
    )
  return null
}
