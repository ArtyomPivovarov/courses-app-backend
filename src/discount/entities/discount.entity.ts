import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Product } from '@/product/entities/product.entity'

@Entity()
@Check(`"discount_percentage" >= 0 AND "discount_percentage" <= 100`)
export class Discount {
  @PrimaryGeneratedColumn({ name: 'discount_id' })
  id: number

  @ManyToMany(() => Product, product => product.discounts)
  @JoinTable({
    name: 'discount_product',
    joinColumn: { name: 'discount_id' },
    inverseJoinColumn: { name: 'product_id' }
  })
  products: Product[]

  @Column({ length: 100 })
  name: string

  @Column({ length: 300 })
  description: string

  @Column('decimal', { name: 'discount_percentage', precision: 5, scale: 2 })
  discountPercentage: number

  @Column('date', { name: 'start_date' })
  startDate: Date

  @Column('date', { name: 'end_date' })
  endDate: Date

  @Column('jsonb', { nullable: true })
  translations: {
    [langCode: string]: {
      name?: string
      description?: string
    }
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
