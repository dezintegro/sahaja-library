import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuth } from '@/shared/hooks/useAuth'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import Head from 'next/head'
import type { IUserUpdateRequest } from '@/shared/types/user'

function ProfilePageContent() {
  const router = useRouter()
  const { user, logout, updateProfile } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    bio: user?.profile?.bio || '',
    phone: user?.profile?.phone || '',
    date_of_birth: user?.profile?.date_of_birth || '',
  })

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      bio: user?.profile?.bio || '',
      phone: user?.profile?.phone || '',
      date_of_birth: user?.profile?.date_of_birth || '',
    })
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    const updateData: IUserUpdateRequest = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      profile: {
        bio: formData.bio,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth || null,
      },
    }

    try {
      await updateProfile(updateData)
      setIsEditing(false)
      setSuccessMessage('Profile updated successfully!')
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update profile. Please try again.'
      setErrorMessage(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Profile | Sahaja Library</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <div className="flex gap-2">
                <Link
                  href="/"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Home
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mx-6 mt-4 rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-800">{successMessage}</div>
              </div>
            )}

            {errorMessage && (
              <div className="mx-6 mt-4 rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">{errorMessage}</div>
              </div>
            )}

            {/* Profile Info */}
            <div className="px-6 py-6">
              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <p className="mt-1 text-sm text-gray-900">{user.first_name || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <p className="mt-1 text-sm text-gray-900">{user.last_name || '-'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{user.profile.phone || '-'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {user.profile.date_of_birth
                        ? new Date(user.profile.date_of_birth).toLocaleDateString()
                        : '-'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {user.profile.bio || '-'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Member Since</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(user.date_joined).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Edit Profile
                    </button>
                    <Link
                      href="/auth/password/change"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Change Password
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <p className="mt-1 text-sm text-gray-500">{user.username} (cannot be changed)</p>
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
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.last_name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      maxLength={500}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    <p className="mt-1 text-xs text-gray-500">{formData.bio.length}/500 characters</p>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  )
}
