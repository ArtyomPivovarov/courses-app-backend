import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateCurrencyDto {
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  code: string

  @IsString()
  @MinLength(1)
  @MaxLength(1)
  symbol: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name: string
}
