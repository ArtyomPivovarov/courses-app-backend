import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Shipping } from '@/shipping/entities/shipping.entity'
import { ShippingMethod } from '@/shipping-method/entities/shipping-method.entity'

@Entity()
export class ShippingCarrier {
  @PrimaryGeneratedColumn({ name: 'shipping_carrier_id' })
  id: number

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean

  @Column({ length: 100, unique: true })
  name: string

  @Column({ length: 300 })
  description: string

  @Column({ length: 255, name: 'website_url' })
  websiteUrl: string

  @ManyToMany(
    () => ShippingMethod,
    shippingMethod => shippingMethod.shippingCarriers
  )
  @JoinTable()
  shippingMethods: ShippingMethod[]

  @OneToMany(() => Shipping, shipping => shipping.shippingCarrier)
  shippings: Shipping[]

  @Column('jsonb', { nullable: true })
  translations: {
    [langCode: string]: {
      name?: string
      description?: string
    }
  }
}
