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
import { Transaction } from '@/transaction/entities/transaction.entity'
import { OrderDetail } from '@/order-detail/entities/order-detail.entity'

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
    default: OrderStatus.CREATED
  })
  status: OrderStatus

  @OneToMany(() => OrderDetail, orderDetail => orderDetail.order)
  orderDetails: OrderDetail[]

  @OneToOne(() => Transaction, transaction => transaction.order)
  transaction: Transaction

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
