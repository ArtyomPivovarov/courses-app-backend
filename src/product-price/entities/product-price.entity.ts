import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { Product } from '@/product/entities/product.entity'
import { Currency } from '@/currency/entities/currency.entity'

@Entity()
@Check(`"price" > 0`)
export class ProductPrice {
  @PrimaryColumn('integer', { name: 'product_id' }) // Todo: remove type annotation
  @ManyToOne(() => Product, product => product.prices)
  product: Product

  @ManyToOne(() => Currency, currency => currency.prices)
  @JoinColumn({ name: 'currency_code' })
  currency: Currency

  @Column('decimal', { precision: 19, scale: 10 })
  price: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
