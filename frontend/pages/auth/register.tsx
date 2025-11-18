import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuth } from '@/shared/hooks/useAuth'
import Head from 'next/head'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isAuthenticated, error, clearError } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile')
    }
  }, [isAuthenticated, router])

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.username) {
      errors.username = 'Username is required'
    }

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Passwords do not match'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormErrors({})

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await register(formData)
      router.push('/profile')
    } catch (err: any) {
      const errorData = err.response?.data
      if (errorData && typeof errorData === 'object') {
        setFormErrors(errorData)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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

  return (
    <>
      <Head>
        <title>Register | Sahaja Library</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                sign in to existing account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username *
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    formErrors.username ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.username && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    formErrors.password ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Password (min. 8 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700">
                  Confirm Password *
                </label>
                <input
                  id="password_confirm"
                  name="password_confirm"
                  type="password"
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    formErrors.password_confirm ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Confirm Password"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.password_confirm && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password_confirm}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </div>

            <div className="text-center">
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
                Back to home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
