import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { ProductPrice } from '@/product-price/entities/product-price.entity'
import { Transaction } from '@/transaction/entities/transaction.entity'

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

  @OneToMany(() => Transaction, transaction => transaction.currency)
  transactions: Transaction[]
}
