import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Order } from '@/order/entities/order.entity'
import { ShippingStatus } from '@/shipping/shipping.types'
import { ShippingCarrier } from '@/shipping-carrier/entities/shipping-carrier.entity'
import { ShippingMethod } from '@/shipping-method/entities/shipping-method.entity'

@Entity()
export class Shipping {
  @PrimaryGeneratedColumn({ name: 'shipping_id' })
  id: number

  @ManyToOne(() => Order, order => order.shippings)
  @JoinColumn({ name: 'order_id' })
  order: Order

  @ManyToOne(
    () => ShippingCarrier,
    shippingCarrier => shippingCarrier.shippings
  )
  @JoinColumn({ name: 'carrier_id' })
  shippingCarrier: ShippingCarrier

  @ManyToOne(() => ShippingMethod, shippingMethod => shippingMethod.shippings)
  @JoinColumn({ name: 'shipping_method_id' })
  shippingMethod: ShippingMethod

  @Column({ length: 300 })
  address: string

  @Column({
    type: 'enum',
    enum: ShippingStatus,
    default: ShippingStatus.Created
  })
  status: ShippingStatus

  @Column({ name: 'tracking_number', nullable: true })
  trackingNumber: string

  @Column({ name: 'shipping_fee', type: 'decimal', precision: 19, scale: 10 })
  shippingFee: number

  @Column('date', { name: 'estimated_delivery_date' })
  estimatedDeliveryDate: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
