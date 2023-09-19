import { FullUserProfile, UserProfile } from '@/user/user.types'
import { User } from '@/user/entities/user.entity'

export function buildUserProfile(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name
  }
}

export function buildFullUserProfile(user: User): FullUserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    refreshToken: user.refreshToken
  }
}
