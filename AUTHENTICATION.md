# Authentication System Documentation

This document describes the authentication system implemented for the Sahaja Library project.

## Overview

The authentication system provides user registration, login, logout, password management, and user profile functionality. It uses session-based authentication with Django backend and Next.js frontend.

## Architecture

### Backend (Django)

**Location**: `api-backend/modules/authentication/`

**Components**:
- **Models** (`models.py`):
  - `UserProfile`: Extended user profile with additional fields (bio, avatar, date_of_birth, phone)

- **Serializers** (`serializers.py`):
  - `UserSerializer`: User data serialization
  - `UserProfileSerializer`: Profile data serialization
  - `UserRegistrationSerializer`: Registration validation and user creation
  - `UserLoginSerializer`: Login credentials validation
  - `PasswordChangeSerializer`: Password change validation
  - `PasswordResetRequestSerializer`: Password reset request
  - `PasswordResetConfirmSerializer`: Password reset confirmation
  - `UserUpdateSerializer`: Profile update validation

- **Views** (`views.py`):
  - `RegisterView`: User registration endpoint
  - `LoginView`: User login endpoint
  - `LogoutView`: User logout endpoint
  - `CurrentUserView`: Get current authenticated user
  - `PasswordChangeView`: Change password endpoint
  - `PasswordResetRequestView`: Request password reset
  - `PasswordResetConfirmView`: Confirm password reset
  - `UserProfileView`: Get and update user profile

**API Endpoints**:

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/auth/register/` | POST | No | Register new user |
| `/api/auth/login/` | POST | No | Login user |
| `/api/auth/logout/` | POST | Yes | Logout user |
| `/api/auth/me/` | GET | Yes | Get current user |
| `/api/auth/profile/` | GET, PUT, PATCH | Yes | Get/update profile |
| `/api/auth/password/change/` | POST | Yes | Change password |
| `/api/auth/password/reset/` | POST | No | Request password reset |
| `/api/auth/password/reset/confirm/` | POST | No | Confirm password reset |

### Frontend (Next.js)

**Location**: `frontend/`

**Components**:

1. **API Client** (`src/shared/api/auth.ts`):
   - Axios instance with credentials support
   - CSRF token handling
   - All authentication API methods

2. **Auth Context** (`src/shared/contexts/AuthContext.tsx`):
   - Global authentication state management
   - User data storage
   - Authentication methods (login, register, logout, etc.)

3. **Custom Hook** (`src/shared/hooks/useAuth.ts`):
   - Easy access to authentication context
   - Usage: `const { user, isAuthenticated, login, logout } = useAuth()`

4. **Protected Route** (`src/components/common/ProtectedRoute/index.tsx`):
   - Wrapper component for protected pages
   - Redirects to login if not authenticated
   - Shows loading state during auth check

5. **UI Components**:
   - `UserMenu`: User dropdown menu with profile links
   - `AuthButtons`: Shows login/register buttons or UserMenu

**Pages**:

| Page | Path | Description |
|------|------|-------------|
| Login | `/auth/login` | User login form |
| Register | `/auth/register` | User registration form |
| Profile | `/profile` | User profile view/edit (protected) |
| Change Password | `/auth/password/change` | Password change form (protected) |
| Reset Password | `/auth/password/reset` | Password reset request |
| Confirm Reset | `/auth/password/reset-confirm` | Password reset confirmation |

## Authentication Flow

### Registration

1. User fills registration form with username, email, password
2. Frontend validates form data
3. POST request to `/api/auth/register/`
4. Backend creates user and profile
5. User is automatically logged in
6. Redirect to profile page

### Login

1. User enters username and password
2. POST request to `/api/auth/login/`
3. Backend authenticates user and creates session
4. Session cookie is set
5. User data is stored in context
6. Redirect to profile page

### Logout

1. User clicks logout
2. POST request to `/api/auth/logout/`
3. Backend destroys session
4. Frontend clears user state
5. Redirect to home page

### Password Reset

1. User requests password reset with email
2. POST request to `/api/auth/password/reset/`
3. Backend sends email with reset link
4. User clicks link in email
5. User enters new password
6. POST request to `/api/auth/password/reset/confirm/`
7. Password is reset
8. Redirect to login page

## Security Features

### Backend

- **Session-based authentication**: Secure cookies with HTTPOnly flag
- **CSRF protection**: Django CSRF middleware
- **Password validation**: Django password validators (min length, complexity, etc.)
- **Password hashing**: Django's built-in PBKDF2 hashing
- **Token-based password reset**: Secure one-time tokens

### Frontend

- **CSRF token handling**: Automatic inclusion in requests
- **Credentials in requests**: `withCredentials: true` for cookies
- **Protected routes**: Automatic redirect for unauthorized access
- **Form validation**: Client-side validation before submission

### CORS Configuration

```python
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "https://your-domain.com",
    "http://localhost:3000",  # Development
]
```

### Cookie Settings

```python
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_HTTPONLY = False  # JS needs to read CSRF token
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SECURE = True  # HTTPS only in production
CSRF_COOKIE_SECURE = True     # HTTPS only in production
```

## Database Schema

### User Table (Django default)

- `id`: BigAutoField
- `username`: CharField (unique)
- `email`: EmailField
- `password`: CharField (hashed)
- `first_name`: CharField
- `last_name`: CharField
- `date_joined`: DateTimeField

### UserProfile Table

- `id`: BigAutoField
- `user`: OneToOneField → User
- `bio`: TextField (max 500 chars)
- `avatar`: URLField
- `date_of_birth`: DateField (nullable)
- `phone`: CharField (max 20 chars)
- `created_at`: DateTimeField
- `updated_at`: DateTimeField

## Environment Variables

### Backend

```env
FRONTEND_URL=http://localhost:3000
DEFAULT_FROM_EMAIL=noreply@sahaja-library.org
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Frontend

```env
NEXT_PUBLIC_BACKEND_API_URL=/api
# or for development:
# NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000/api
```

## Usage Examples

### Using Authentication in Components

```typescript
import { useAuth } from '@/shared/hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <div>Please login</div>
  }

  return (
    <div>
      <h1>Hello, {user.username}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Creating Protected Pages

```typescript
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  )
}
```

### Making Authenticated API Requests

```typescript
import { authAPI } from '@/shared/api/auth'

// Update profile
const updateProfile = async () => {
  try {
    const updatedUser = await authAPI.updateProfile({
      first_name: 'John',
      last_name: 'Doe',
      profile: {
        bio: 'My bio',
        phone: '+1234567890',
      },
    })
    console.log('Profile updated:', updatedUser)
  } catch (error) {
    console.error('Failed to update profile:', error)
  }
}
```

## Development Setup

### Backend

1. Install dependencies:
   ```bash
   cd api-backend
   poetry install
   ```

2. Run migrations:
   ```bash
   python manage.py migrate
   ```

3. Create superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

4. Run development server:
   ```bash
   python manage.py runserver
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Access the app at `http://localhost:3000`

## Testing

### Manual Testing Checklist

- [ ] User can register with valid credentials
- [ ] User cannot register with existing username/email
- [ ] User can login with correct credentials
- [ ] User cannot login with incorrect credentials
- [ ] User can view and edit profile
- [ ] User can change password
- [ ] User can request password reset
- [ ] User can reset password with valid token
- [ ] User can logout
- [ ] Protected routes redirect to login when not authenticated
- [ ] Session persists across page refreshes
- [ ] CSRF protection works correctly

## Future Enhancements

- Email verification on registration
- Social authentication (Google, VK)
- Two-factor authentication (2FA)
- Rate limiting for login attempts
- Account deletion
- User activity log
- Remember me functionality
- API token authentication for mobile apps

## Troubleshooting

### CSRF Token Issues

If you encounter CSRF errors, ensure:
- CORS is properly configured with `CORS_ALLOW_CREDENTIALS = True`
- Frontend is sending credentials: `withCredentials: true`
- CSRF token cookie is being set and read correctly

### Session Not Persisting

Check:
- Cookie domain settings match your domain
- Cookies are not blocked by browser
- `SESSION_COOKIE_SECURE` is `False` in development (HTTP)

### Email Not Sending

For development:
- Check console output (using `console.EmailBackend`)

For production:
- Verify SMTP credentials
- Check firewall/port settings
- Ensure EMAIL_USE_TLS is configured correctly

## Support

For issues or questions, please create an issue in the project repository.
