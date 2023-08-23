import {
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
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  id: number

  @Column() // TODO: add unique
  slug: string

  @Column({ name: 'is_active' })
  isActive: boolean

  @Column({ name: 'name_en' })
  nameEn: string

  @Column({ name: 'name_ru' })
  nameRu: string

  @Column({ name: 'price_usd' })
  priceUsd: number

  @Column({ name: 'price_rub' })
  priceRub: number

  @Column({ name: 'price_btc' })
  priceBtc: number

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
