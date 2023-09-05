import { ProductCategory } from '@/product-category/entities/product-category.entity'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  Matches,
  MaxLength,
  Min,
  MinLength
} from 'class-validator'
import { kebabCaseRegex } from '@/common/regex/cases.regex'

export class CreateProductDto {
  @IsNotEmpty()
  @Matches(kebabCaseRegex, {
    message: 'Slug must be in kebab-case'
  })
  slug: string

  @IsBoolean()
  isActive: boolean

  @MinLength(3, { message: 'Minimum name en length is 3 characters' })
  @MaxLength(30, { message: 'Maximum name en length is 30 characters' })
  name: string

  @IsNumber()
  @IsPositive({ message: 'Price usd must be a positive number' })
  priceUSD: number

  @IsNumber()
  @IsPositive({ message: 'Price rub must be a positive number' })
  priceRUB: number

  @IsNumber()
  @IsPositive({ message: 'Price btc must be a positive number' })
  priceBTC: number

  @IsNumber()
  @Min(0, { message: 'Stock must be a positive number or zero' })
  stock: number

  @IsNotEmpty()
  categoryId: ProductCategory['id']

  @IsOptional()
  @IsNumber()
  rating?: number

  @IsOptional()
  description?: string

  @IsOptional()
  @IsObject({ message: 'Translations must be an object', each: true })
  translations?: {
    [langCode: string]: {
      name?: string
      description?: string
    }
  }
}
