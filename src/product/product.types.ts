import { Product } from '@/product/entities/product.entity'

export type ProductListItem = Pick<
  Product,
  'id' | 'slug' | 'isActive' | 'name' | 'prices' | 'rating' | 'createdAt'
> & {
  category: Pick<Product['category'], 'id' | 'slug' | 'name' | 'translations'>
}
