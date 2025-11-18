import { useAuth } from '@/shared/hooks/useAuth'
import { UserMenu } from '../UserMenu'

export const AuthButtons: React.FC = () => {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
      </div>
    )
  }

  return <UserMenu />
}

export default AuthButtons
