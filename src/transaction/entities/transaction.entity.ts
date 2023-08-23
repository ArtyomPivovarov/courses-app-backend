import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Currency } from '@/types/currency.types'
import { User } from '@/user/entities/user.entity'
import { Product } from '@/product/entities/product.entity'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'transaction_id' })
  id: number

  @Column()
  amount: number

  @Column()
  currency: Currency

  @ManyToOne(() => User, user => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Product, product => product.transactions)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
