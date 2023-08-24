import { MinLength } from 'class-validator'

export class UpdateUserDto {
  @MinLength(3, { message: 'Name must be more than 3 symbols' })
  name: string
}
