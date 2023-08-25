import { ProductCategory } from '@/product-category/entities/product-category.entity'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength
} from 'class-validator'
export class CreateProductDto {
  @IsNotEmpty()
  slug: string

  @IsBoolean()
  isActive: boolean

  @MinLength(3, { message: 'Minimum name en length is 3 characters' })
  @MaxLength(30, { message: 'Maximum name en length is 30 characters' })
  nameEn: string

  @MinLength(3, { message: 'Minimum name ru length is 3 characters' })
  @MaxLength(30, { message: 'Maximum name ru length is 30 characters' })
  nameRu: string

  @IsNumber()
  priceUsd: number

  @IsNumber()
  priceRub: number

  @IsNumber()
  priceBtc: number

  @IsNotEmpty()
  categoryId: ProductCategory['id']

  @IsOptional()
  descriptionEn?: string

  @IsOptional()
  descriptionRu?: string
}
