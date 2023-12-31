import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UpdateUserProfileDto } from '@/user/dto/update-user-profile.dto'
import { Roles } from '@/role/roles.decorator'
import { Role } from '@/role/role.enum'
import { RolesGuard } from '@/role/roles.guard'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { UpdateUserDto } from '@/user/dto/update-user.dto'
import { RegisterUserDto } from '@/user/dto/register-user.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from '@/auth/public.decorator'

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({ summary: 'Create user' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.userService.findAll(paginationQueryDto)
  }

  @ApiOperation({ summary: 'Get user by id' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userService.getFullUserProfileById(+id)
  }

  @ApiOperation({ summary: 'Update user by id' })
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(+id, updateUserDto)
  }

  @Public()
  @ApiOperation({ summary: 'Register user' })
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto)
  }

  @ApiOperation({ summary: 'Get your profile' })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.userService.getProfile(+req.user.id)
  }

  @ApiOperation({ summary: 'Update your profile' })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req,
    @Body() updateUserProfileDto: UpdateUserProfileDto
  ) {
    await this.userService.updateProfile(+req.user.id, updateUserProfileDto)
  }
}
