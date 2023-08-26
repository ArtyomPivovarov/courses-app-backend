import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '@/user/entities/user.entity'
import { Product } from '@/product/entities/product.entity'

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn({ name: 'purchase_id' })
  id: number

  @ManyToOne(() => User, user => user.purchases)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Product, product => product.purchases)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
