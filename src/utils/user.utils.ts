import { IUserProfile } from '@/types/user.types'
import { User } from '@/user/entities/user.entity'

export function buildUserProfile(user: User): IUserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name
  }
}
