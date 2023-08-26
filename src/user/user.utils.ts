import { UserProfile } from '@/user/user.types'
import { User } from '@/user/entities/user.entity'

export function buildUserProfile(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    transactions: user.transactions
  }
}
