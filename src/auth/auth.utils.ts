import { JwtService } from '@nestjs/jwt'
import { User } from '@/user/entities/user.entity'

export function createAccessToken(
  id: User['id'],
  email: User['email'],
  jwtService: JwtService
) {
  return jwtService.sign({ id, email })
}
