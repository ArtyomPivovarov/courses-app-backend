import { User } from '@/user/entities/user.entity'

export type UserProfile = {
  id: User['id']
  email: User['email']
  name: User['name']
}

export type FullUserProfile = {
  id: User['id']
  email: User['email']
  name: User['name']
  role: User['role']
  refreshToken: User['refreshToken']
}
