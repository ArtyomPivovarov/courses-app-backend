import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { Transaction } from '@/transaction/entities/transaction.entity'
import { Purchase } from '@/purchase/entities/purchase.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column({ name: 'password_hash' })
  passwordHash: string

  @OneToMany(() => Purchase, purchase => purchase.user)
  purchases: Purchase[]

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
