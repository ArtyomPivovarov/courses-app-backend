import { Product } from '@/product/entities/product.entity'

export type ProductListItem = Pick<
  Product,
  | 'id'
  | 'slug'
  | 'isActive'
  | 'nameEn'
  | 'nameRu'
  | 'priceUSD'
  | 'priceBTC'
  | 'priceRUB'
  | 'rating'
  | 'createdAt'
> & {
  category: Pick<Product['category'], 'id' | 'slug' | 'nameEn' | 'nameRu'>
}
