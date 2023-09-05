import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '@/user/entities/user.entity'
import { Order } from '@/order/entities/order.entity'
import { Currency } from '@/currency/entities/currency.entity'

@Entity()
@Check(`"amount" > 0`)
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'transaction_id' })
  id: number

  @Column('decimal', { precision: 19, scale: 10 })
  amount: number

  @ManyToOne(() => Currency, currency => currency.transactions)
  @JoinColumn({ name: 'currency_code' })
  currency: Currency

  @ManyToOne(() => User, user => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToOne(() => Order, order => order.transaction)
  order: Order

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
