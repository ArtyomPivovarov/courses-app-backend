import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { ProductCategory } from '@/product-category/entities/product-category.entity'
import { ProductPrice } from '@/product-price/entities/product-price.entity'
import { CartItem } from '@/cart-item/entities/cart-item.entity'

@Entity()
@Check(`"stock" >= 0`)
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  id: number

  @Column()
  slug: string

  @Column({ name: 'is_active' })
  isActive: boolean

  @Column()
  name: string

  @OneToMany(() => ProductPrice, price => price.product)
  prices: ProductPrice[]

  @Column()
  stock: number

  @ManyToOne(() => ProductCategory, category => category.products)
  @JoinColumn({ name: 'product_category_id' })
  category: ProductCategory

  @OneToMany(() => CartItem, cartItem => cartItem.product)
  cartItems: CartItem[]

  @Column({ nullable: true })
  rating: number

  @Column({ nullable: true })
  description: string

  @Column('jsonb', { nullable: true })
  translations: {
    [langCode: string]: {
      name?: string
      description?: string
    }
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
