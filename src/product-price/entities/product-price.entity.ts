import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { Product } from '@/product/entities/product.entity'
import { Currency } from '@/currency/entities/currency.entity'

@Entity()
@Check(`"price" > 0`)
export class ProductPrice {
  @PrimaryColumn({ name: 'product_id', type: 'integer' })
  @ManyToOne(() => Product, product => product.prices)
  product: Product

  @PrimaryColumn({ name: 'currency_code', type: 'char', length: 4 })
  @ManyToOne(() => Currency, currency => currency.prices)
  currency: Currency

  @Column('decimal', { precision: 19, scale: 10 })
  price: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
