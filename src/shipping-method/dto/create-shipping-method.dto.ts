import { IsObject, IsOptional, IsString } from 'class-validator'

export class CreateShippingMethodDto {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsOptional()
  @IsObject()
  translations: {
    [langCode: string]: {
      name?: string
      description?: string
    }
  }
}
