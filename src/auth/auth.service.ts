import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '@/user/user.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UserProfile } from '@/user/user.types'
import { User } from '@/user/entities/user.entity'
import { createAccessToken } from '@/auth/auth.utils'
import { buildUserProfile } from '@/user/user.utils'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email)
    if (!user) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const passwordIsMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordIsMatch) {
      throw new UnauthorizedException('Invalid email or password')
    }

    return user
  }

  async login(user: User): Promise<{ user: UserProfile; accessToken: string }> {
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
