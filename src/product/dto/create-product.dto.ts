import { ProductCategory } from '@/product-category/entities/product-category.entity'
export class CreateProductDto {
  isActive: boolean
  slug: string
  nameEn: string
  nameRu: string
  priceUsd: number
  priceRub: number
  priceBtc: number
  category: ProductCategory['id'] // TODO: add validation
  descriptionEn?: string
  descriptionRu?: string
}
