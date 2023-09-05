import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Product } from '@/product/entities/product.entity'

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn({ name: 'product_category_id' })
  id: number

  @Column()
  slug: string

  @Column({ name: 'is_active' })
  isActive: boolean

  @Column()
  name: string

  @OneToMany(() => Product, product => product.category)
  products: Product[]

  @Column({ nullable: true })
  description: string

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
