import { Controller, Post, UseGuards, Request } from '@nestjs/common'
import { LocalAuthGuard } from '@/auth/local-auth.guard'
import { AuthService } from '@/auth/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }
}
