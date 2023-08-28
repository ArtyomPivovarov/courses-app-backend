import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Currency } from '@/common/types/currency.types'
import { User } from '@/user/entities/user.entity'
import { Purchase } from '@/purchase/entities/purchase.entity'

@Entity()
@Check(`"amount" > 0`)
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'transaction_id' })
  id: number

  @Column('decimal', { precision: 19, scale: 10 })
  amount: number

  @Column({ type: 'enum', enum: Currency, default: Currency.USD })
  currency: Currency

  @ManyToOne(() => User, user => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToOne(() => Purchase, purchase => purchase.transaction)
  purchase: Purchase

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
