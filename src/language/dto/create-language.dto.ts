import { IsString, Length, IsNotEmpty } from 'class-validator'

export class CreateLanguageDto {
  @IsString()
  @Length(2, 2, { message: 'Language code must be exactly 2 characters long.' })
  @IsNotEmpty({ message: 'Language code should not be empty' })
  code: string

  @IsString()
  @IsNotEmpty({ message: 'Language name should not be empty' })
  name: string
}
