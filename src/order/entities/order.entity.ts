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
import { Transaction } from '@/transaction/entities/transaction.entity'
import { Product } from '@/product/entities/product.entity'
import { OrderStatus } from '@/order/order.types'
import { TRANSACTION_NEED_PURCHASE_STATUSES } from '@/order/order.const'

@Entity()
@Check(`"quantity" > 0`)
// The following SQL says, if status is in TRANSACTION_NEED_PURCHASE_STATUSES,
// then transaction_id must NOT be NULL.
@Check(
  `NOT ("status"::text = ANY (ARRAY[${TRANSACTION_NEED_PURCHASE_STATUSES.map(
    status => `'${status}'`
  ).join(', ')}]::text[]) AND "transaction_id" IS NULL)`
)
export class Order {
  @PrimaryGeneratedColumn({ name: 'order_id' })
  id: number

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Product, product => product.orders)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @OneToOne(() => Transaction, transaction => transaction.order, {
    nullable: true
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction

  @Column({ name: 'quantity' })
  quantity: number

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.CREATED
  })
  status: OrderStatus

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
