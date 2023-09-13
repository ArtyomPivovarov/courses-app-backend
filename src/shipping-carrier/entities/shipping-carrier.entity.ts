import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Shipping } from '@/shipping/entities/shipping.entity'

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
