import {
  IsArray,
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength
} from 'class-validator'

export class CreateDiscountDto {
  @IsOptional()
  @IsArray()
  productIds: number[]

  @IsString()
  @MaxLength(100)
  name: string

  @IsString()
  @MaxLength(300)
  description: string

  @IsNumber()
  @IsPositive()
  @Max(100)
  discountPercentage: number

  @IsDateString()
  startDate: Date

  @IsDateString()
  endDate: Date

  @IsOptional()
  @IsObject()
  translations: {
    [langCode: string]: {
      name?: string
      description?: string
    }
  }
}
