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
import { Role } from '@/role/role.enum'

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

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role

  @OneToMany(() => Purchase, purchase => purchase.user)
  purchases: Purchase[]

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
