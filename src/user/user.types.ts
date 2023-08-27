import { User } from '@/user/entities/user.entity'

export type UserProfile = {
  id: User['id']
  email: User['email']
  name: User['name']
}

export type UserAdminProfile = {
  id: User['id']
  email: User['email']
  name: User['name']
  role: User['role']
}
