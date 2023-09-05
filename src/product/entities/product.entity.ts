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
import { Order } from '@/order/entities/order.entity'

@Entity()
@Check(`"price_usd" > 0`)
@Check(`"price_btc" > 0`)
@Check(`"price_rub" > 0`)
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

  @Column('decimal', { name: 'price_usd', precision: 10, scale: 2 })
  priceUSD: number

  @Column('decimal', { name: 'price_rub', precision: 11, scale: 2 })
  priceRUB: number

  @Column('decimal', { name: 'price_btc', precision: 14, scale: 10 })
  priceBTC: number

  @Column()
  stock: number

  @ManyToOne(() => ProductCategory, category => category.products)
  @JoinColumn({ name: 'product_category_id' })
  category: ProductCategory

  @OneToMany(() => Order, order => order.product)
  orders: Order[]

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
