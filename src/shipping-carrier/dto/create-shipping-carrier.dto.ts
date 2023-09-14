import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator'

export class CreateShippingCarrierDto {
  @IsBoolean()
  isActive: boolean

  @IsString()
  @MaxLength(100)
  name: string

  @IsString()
  @MaxLength(300)
  description: string

  @IsString()
  @MaxLength(255)
  websiteUrl: string

  @IsOptional()
  @IsObject()
  translations: {
    [langCode: string]: {
      name?: string
      description?: string
    }
  }
}
