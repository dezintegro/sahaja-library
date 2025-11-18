export interface IUserProfile {
  bio: string
  avatar: string
  date_of_birth: string | null
  phone: string
  created_at: string
  updated_at: string
}

export interface IUser {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  profile: IUserProfile
  date_joined: string
}

export interface ILoginRequest {
  username: string
  password: string
}

export interface IRegisterRequest {
  username: string
  email: string
  password: string
  password_confirm: string
  first_name?: string
  last_name?: string
}

export interface IPasswordChangeRequest {
  old_password: string
  new_password: string
  new_password_confirm: string
}

export interface IPasswordResetRequest {
  email: string
}

export interface IPasswordResetConfirmRequest {
  uidb64: string
  token: string
  new_password: string
  new_password_confirm: string
}

export interface IUserUpdateRequest {
  email?: string
  first_name?: string
  last_name?: string
  profile?: Partial<IUserProfile>
}

export interface IAuthResponse {
  message: string
  user?: IUser
}

export interface IAuthError {
  error?: string
  [key: string]: any
}
