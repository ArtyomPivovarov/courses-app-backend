import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from '@/user/entities/user.entity'
import { OrderStatus } from '@/order/order.types'
import { Payment } from '@/payment/entities/payment.entity'
import { OrderDetail } from '@/order-detail/entities/order-detail.entity'
import { Shipping } from '@/shipping/entities/shipping.entity'

@Entity()
@Check(`"total_price" > 0`)
export class Order {
  @PrimaryGeneratedColumn({ name: 'order_id' })
  id: number

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column('decimal', { name: 'total_price', precision: 19, scale: 10 })
  totalPrice: number

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Created
  })
  status: OrderStatus

  @OneToMany(() => OrderDetail, orderDetail => orderDetail.order)
  orderDetails: OrderDetail[]

  @OneToOne(() => Payment, payment => payment.order)
  payment: Payment

  @OneToMany(() => Shipping, shipping => shipping.order)
  shippings: Shipping[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
