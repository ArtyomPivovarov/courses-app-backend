import { PickType } from '@nestjs/mapped-types'
import { CreateUserDto } from '@/user/dto/create-user.dto'

export class UpdateUserDto extends PickType(CreateUserDto, ['name']) {}
