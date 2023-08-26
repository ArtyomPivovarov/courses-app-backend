import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UserProfile } from '@/user/user.types'
import { User } from '@/user/entities/user.entity'
import { buildUserProfile } from '@/user/user.utils'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  async validate(
    data: User & Record<string, string | number>
  ): Promise<UserProfile> {
    return buildUserProfile(data)
  }
}
