import {
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'

export class CreateProductPriceDto {
  @IsNumber()
  productId: number

  @IsString()
  @MaxLength(3, { message: 'Maximum currency code length is 3 characters' })
  @MinLength(3, { message: 'Minimum currency code length is 3 characters' })
  currencyCode: string

  @IsNumber()
  @IsPositive({ message: 'Price must be a positive number' })
  price: number
}
