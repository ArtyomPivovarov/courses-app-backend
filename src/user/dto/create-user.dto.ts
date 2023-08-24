import { IsEmail, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail(undefined, { message: 'Email is not valid' })
  email: string

  @MinLength(6, { message: 'Password must be more than 6 symbols' })
  password: string

  @MinLength(3, { message: 'Name must be more than 3 symbols' })
  name: string
}
