import { JwtService } from '@nestjs/jwt'
import { IUserProfile } from '@/types/user.types'

export function createAccessToken(
  userProfile: IUserProfile,
  jwtService: JwtService
) {
  console.log('createAccessToken', userProfile)
  return jwtService.sign(userProfile)
}
