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
import { Order } from '@/order/entities/order.entity'
import { Currency } from '@/currency/entities/currency.entity'
import { PaymentMethod } from '@/payment-method/entities/payment-method.entity'

@Entity()
@Check(`"amount" > 0`)
export class Payment {
  @PrimaryGeneratedColumn({ name: 'payment_id' })
  id: number

  @OneToOne(() => Order, order => order.payment)
  @JoinColumn({ name: 'order_id' })
  order: Order

  @ManyToOne(() => PaymentMethod, paymentMethod => paymentMethod.payments)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod

  @Column('decimal', { precision: 19, scale: 10 })
  amount: number

  @ManyToOne(() => Currency, currency => currency.payments)
  @JoinColumn({ name: 'currency_code' })
  currency: Currency

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
