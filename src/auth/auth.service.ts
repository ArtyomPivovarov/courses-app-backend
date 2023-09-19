import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '@/user/user.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { User } from '@/user/entities/user.entity'
import { buildUserProfile } from '@/user/user.utils'
import { SuccessAuthResponse, UserTokenPayload } from '@/auth/auth.types'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class AuthService {
  private userService: UserService
  constructor(
    private readonly jwtService: JwtService,
    private readonly userModuleRef: ModuleRef
  ) {}

  onModuleInit() {
    this.userService = this.userModuleRef.get(UserService, { strict: false })
  }

  async login(user: User): Promise<SuccessAuthResponse> {
    return {
      user: buildUserProfile(user),
      accessToken: this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user)
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email)
    if (!user) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const passwordIsMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordIsMatch) {
      throw new UnauthorizedException('Invalid email or password')
    }

    return user
  }

  async validateRefreshToken(token: string): Promise<User> {
    const payload = this.jwtService.verify(token)
    const user = await this.userService.findOneById(payload.id)
    if (!user || user.refreshToken !== token) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    return user
  }

  generateAccessToken({ id, email, role }: UserTokenPayload) {
    return this.jwtService.sign({
      id,
      email,
      role
    })
  }

  async generateRefreshToken({
    id,
    email,
    role
  }: UserTokenPayload): Promise<string> {
    const refreshToken = this.jwtService.sign({ id, email, role })
    await this.userService.update(id, { refreshToken })
    return refreshToken
  }
}
