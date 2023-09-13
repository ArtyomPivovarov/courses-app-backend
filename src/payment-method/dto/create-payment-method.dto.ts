import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator'

export class CreatePaymentMethodDto {
  @IsBoolean()
  isActive: boolean

  @IsString()
  @MaxLength(30)
  name: string

  @IsString()
  @MaxLength(100)
  description: string

  @IsNumber()
  rating: number

  @IsOptional()
  @IsObject()
  translations: {
    [langCode: string]: {
      name?: string
      description?: string
    }
  }
}
