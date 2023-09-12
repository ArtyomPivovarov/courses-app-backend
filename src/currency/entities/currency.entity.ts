import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { ProductPrice } from '@/product-price/entities/product-price.entity'
import { Payment } from '@/payment/entities/payment.entity'

@Entity()
export class Currency {
  @PrimaryColumn({ length: 4, name: 'currency_code' })
  code: string

  @Column({ length: 1, name: 'currency_symbol' })
  symbol: string

  @Column({ length: 30 })
  name: string

  @OneToMany(() => ProductPrice, price => price.currency)
  prices: ProductPrice[]

  @OneToMany(() => Payment, payment => payment.currency)
  payments: Payment[]
}
