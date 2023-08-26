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
import { Transaction } from '@/transaction/entities/transaction.entity'
import { ProductCategory } from '@/product-category/entities/product-category.entity'

@Entity()
@Check(`"price_usd" > 0`)
@Check(`"price_btc" > 0`)
@Check(`"price_rub" > 0`)
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  id: number

  @Column()
  slug: string

  @Column({ name: 'is_active' })
  isActive: boolean

  @Column({ name: 'name_en' })
  nameEn: string

  @Column({ name: 'name_ru' })
  nameRu: string

  @Column('decimal', { name: 'price_usd', precision: 10, scale: 2 })
  priceUsd: number

  @Column('decimal', { name: 'price_rub', precision: 11, scale: 2 })
  priceRub: number

  @Column('decimal', { name: 'price_btc', precision: 14, scale: 10 })
  priceBtc: number

  @Column({ nullable: true })
  rating: number

  @ManyToOne(() => ProductCategory, category => category.products)
  @JoinColumn({ name: 'product_category_id' })
  category: ProductCategory

  @OneToMany(() => Transaction, transaction => transaction.product)
  transactions: Transaction[]

  @Column({ nullable: true, name: 'description_en' })
  descriptionEn: string

  @Column({ nullable: true, name: 'description_ru' })
  descriptionRu: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
