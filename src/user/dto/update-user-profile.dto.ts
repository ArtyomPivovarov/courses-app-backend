import { PickType } from '@nestjs/mapped-types'
import { CreateUserDto } from '@/user/dto/create-user.dto'

export class UpdateUserProfileDto extends PickType(CreateUserDto, ['name']) {}
