import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '@/user/user.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { IUserProfile } from '@/types/user.types'
import { User } from '@/user/entities/user.entity'
import { createAccessToken } from '@/utils/auth.utils'
import { buildUserProfile } from '@/utils/user.utils'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email)
    const passwordIsMatch = await bcrypt.compare(password, user.passwordHash)
    if (!user || !passwordIsMatch) {
      throw new UnauthorizedException('Invalid email or password')
    }

    return user
  }

  async login(
    user: User
  ): Promise<{ user: IUserProfile; accessToken: string }> {
    const userProfile = buildUserProfile(user)
    return {
      user: userProfile,
      accessToken: createAccessToken(userProfile, this.jwtService)
    }
  }
}
