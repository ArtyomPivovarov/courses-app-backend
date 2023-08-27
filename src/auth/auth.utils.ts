import { JwtService } from '@nestjs/jwt'
import { UserTokenPayload } from '@/auth/auth.types'

export function createAccessToken(
  tokenPayload: UserTokenPayload,
  jwtService: JwtService
) {
  return jwtService.sign(tokenPayload)
}
