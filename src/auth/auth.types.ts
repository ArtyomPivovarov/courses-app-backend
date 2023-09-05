import { User } from '@/user/entities/user.entity'
import { UserProfile } from '@/user/user.types'

export type UserTokenPayload = {
  id: User['id']
  email: User['email']
  role: User['role']
}

export type SuccessAuthResponse = {
  user: UserProfile
  accessToken: string
}
