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

  @Column() // TODO: add unique
  slug: string

  @Column({ name: 'is_active' })
  isActive: boolean

  @Column({ name: 'name_en' })
  nameEn: string

  @Column({ name: 'name_ru' })
  nameRu: string

  @OneToMany(() => Product, product => product.category)
  products: Product[]

  @Column({ nullable: true, name: 'description_en' })
  descriptionEn: string

  @Column({ nullable: true, name: 'description_ru' })
  descriptionRu: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
