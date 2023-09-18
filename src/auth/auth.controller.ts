import { Controller, Post, UseGuards, Request } from '@nestjs/common'
import { LocalAuthGuard } from '@/auth/local-auth.guard'
import { AuthService } from '@/auth/auth.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SuccessAuthResponse } from '@/auth/auth.types'
import { Public } from '@/auth/public.decorator'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({
    summary: 'Log in',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string'
              },
              password: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated'
    // todo type
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<SuccessAuthResponse> {
    return this.authService.login(req.user)
  }
}
