import { MaxLength, MinLength } from 'class-validator'

export class UpdateUserDto {
  @MinLength(3, { message: 'Minimum name length is 3 characters' })
  @MaxLength(30, { message: 'Maximum password length is 30 characters' })
  name: string
}
