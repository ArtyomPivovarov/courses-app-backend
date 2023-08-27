import { PickType } from '@nestjs/mapped-types'
import { CreateUserDto } from '@/user/dto/create-user.dto'

export class RegisterUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
  'name'
]) {}
