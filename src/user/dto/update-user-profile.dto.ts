import { PickType } from '@nestjs/swagger'
import { CreateUserDto } from '@/user/dto/create-user.dto'

export class UpdateUserProfileDto extends PickType(CreateUserDto, ['name']) {}
