import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuth } from '@/shared/hooks/useAuth'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import Head from 'next/head'

function PasswordChangeContent() {
  const router = useRouter()
  const { changePassword } = useAuth()

  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error for this field
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: '',
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.old_password) {
      errors.old_password = 'Current password is required'
    }

    if (!formData.new_password) {
      errors.new_password = 'New password is required'
    } else if (formData.new_password.length < 8) {
      errors.new_password = 'Password must be at least 8 characters'
    }

    if (formData.new_password !== formData.new_password_confirm) {
      errors.new_password_confirm = 'Passwords do not match'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSuccessMessage(null)
    setErrorMessage(null)
    setFormErrors({})

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await changePassword(formData)
      setSuccessMessage('Password changed successfully!')
      setFormData({
        old_password: '',
        new_password: '',
        new_password_confirm: '',
      })

      // Redirect to profile after 2 seconds
      setTimeout(() => {
        router.push('/profile')
      }, 2000)
    } catch (err: any) {
      const errorData = err.response?.data
      if (errorData && typeof errorData === 'object') {
        setFormErrors(errorData)
      } else {
        setErrorMessage('Failed to change password. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Change Password | Sahaja Library</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Change Password
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {successMessage && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-800">{successMessage}</div>
              </div>
            )}

            {errorMessage && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">{errorMessage}</div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="old_password" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  id="old_password"
                  name="old_password"
                  type="password"
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    formErrors.old_password ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Current Password"
                  value={formData.old_password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.old_password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.old_password}</p>
                )}
              </div>

              <div>
                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="new_password"
                  name="new_password"
                  type="password"
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    formErrors.new_password ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="New Password (min. 8 characters)"
                  value={formData.new_password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.new_password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.new_password}</p>
                )}
              </div>

              <div>
                <label htmlFor="new_password_confirm" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  id="new_password_confirm"
                  name="new_password_confirm"
                  type="password"
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    formErrors.new_password_confirm ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Confirm New Password"
                  value={formData.new_password_confirm}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.new_password_confirm && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.new_password_confirm}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Changing...' : 'Change Password'}
              </button>
              <Link
                href="/profile"
                className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default function PasswordChangePage() {
  return (
    <ProtectedRoute>
      <PasswordChangeContent />
    </ProtectedRoute>
  )
}
