import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Payment } from '@/payment/entities/payment.entity'

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn({ name: 'payment_method_id' })
  id: number

  @Column({ name: 'isActive', default: true })
  isActive: boolean

  @Column({ name: 'payment_method_name', length: 30 })
  name: string

  @Column({ name: 'payment_method_description', length: 100 })
  description: string

  @Column({ nullable: true })
  rating: number

  @Column('jsonb', { nullable: true })
  translations: {
    [langCode: string]: {
      name?: string
      description?: string
    }
  }

  @OneToMany(() => Payment, payment => payment.paymentMethod)
  payments: Payment[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
