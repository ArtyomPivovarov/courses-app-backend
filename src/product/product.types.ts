import { Product } from '@/product/entities/product.entity'

export type ProductListItem = Pick<
  Product,
  | 'id'
  | 'slug'
  | 'isActive'
  | 'name'
  | 'priceUSD'
  | 'priceBTC'
  | 'priceRUB'
  | 'rating'
  | 'createdAt'
> & {
  category: Pick<Product['category'], 'id' | 'slug' | 'nameEn' | 'nameRu'>
}
