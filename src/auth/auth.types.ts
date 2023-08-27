import { User } from '@/user/entities/user.entity'

export type UserTokenPayload = {
  id: User['id']
  email: User['email']
  role: User['role']
}
