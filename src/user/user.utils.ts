import { UserAdminProfile, UserProfile } from '@/user/user.types'
import { User } from '@/user/entities/user.entity'

export function buildUserProfile(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name
  }
}

export function buildUserAdminProfile(user: User): UserAdminProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  }
}
