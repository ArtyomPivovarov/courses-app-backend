import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { Transaction } from '@/transaction/entities/transaction.entity'
import { Order } from '@/order/entities/order.entity'
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

  @OneToMany(() => Order, order => order.user)
  orders: Order[]

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
