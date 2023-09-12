import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Order } from '@/order/entities/order.entity'
import { Product } from '@/product/entities/product.entity'

@Entity()
@Check(`"quantity" > 0`)
export class OrderDetail {
  @PrimaryGeneratedColumn({ name: 'order_detail_id' })
  id: number

  @ManyToOne(() => Order, order => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: Order

  @ManyToOne(() => Product, product => product.orderDetails)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @Column('integer')
  quantity: number

  @Column('decimal', { precision: 19, scale: 10 })
  price: number
}
