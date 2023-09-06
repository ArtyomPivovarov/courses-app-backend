import {
  IsNotEmpty,
  IsString,
  IsUppercase,
  Length,
  MaxLength,
  MinLength
} from 'class-validator'

export class CreateCurrencyDto {
  @IsString()
  @IsUppercase()
  @MinLength(3)
  @MaxLength(4)
  code: string

  @IsString()
  @Length(1, 1)
  symbol: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name: string
}
