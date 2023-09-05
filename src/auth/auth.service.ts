import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '@/user/user.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { User } from '@/user/entities/user.entity'
import { createAccessToken } from '@/auth/auth.utils'
import { buildUserProfile } from '@/user/user.utils'
import { SuccessAuthResponse } from '@/auth/auth.types'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email)
    if (!user) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const passwordIsMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordIsMatch) {
      throw new UnauthorizedException('Invalid email or password')
    }

    return user
  }

  async login(user: User): Promise<SuccessAuthResponse> {
    return {
      user: buildUserProfile(user),
      accessToken: createAccessToken(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        this.jwtService
      )
    }
  }
}
