import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Shipping } from '@/shipping/entities/shipping.entity'
import { ShippingCarrier } from '@/shipping-carrier/entities/shipping-carrier.entity'

@Entity()
export class ShippingMethod {
  @PrimaryGeneratedColumn({ name: 'shipping_method_id' })
  id: number

  @Column({ length: 100, unique: true })
  name: string

  @Column({ length: 300 })
  description: string

  @ManyToMany(
    () => ShippingCarrier,
    shippingCarrier => shippingCarrier.shippingMethods
  )
  shippingCarriers: ShippingCarrier[]

  @OneToMany(() => Shipping, shipping => shipping.shippingMethod)
  shippings: Shipping[]

  @Column('jsonb', { nullable: true })
  translations: {
    [langCode: string]: {
      name?: string
      description?: string
    }
  }
}
