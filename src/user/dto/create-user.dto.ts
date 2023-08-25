import { IsEmail, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail(undefined, { message: 'Email is not valid' })
  @MaxLength(50, { message: 'Maximum email length is 50 characters' })
  email: string

  @MinLength(6, { message: 'Minimum password length is 6 characters' })
  @MaxLength(20, { message: 'Maximum password length is 20 characters' })
  password: string

  @MinLength(3, { message: 'Minimum name length is 3 characters' })
  @MaxLength(30, { message: 'Maximum password length is 30 characters' })
  name: string
}
