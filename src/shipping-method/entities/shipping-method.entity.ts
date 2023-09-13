import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Shipping } from '@/shipping/entities/shipping.entity'

@Entity()
export class ShippingMethod {
  @PrimaryGeneratedColumn({ name: 'shipping_method_id' })
  id: number

  @Column({ length: 100, unique: true })
  name: string

  @Column({ length: 300 })
  description: string

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
