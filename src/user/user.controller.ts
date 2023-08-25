import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Request
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.userService.getProfile(+req.user.id)
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(+req.user.id, updateUserDto)
  }
}
