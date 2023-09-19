import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { Order } from '@/order/entities/order.entity'
import { Role } from '@/role/role.enum'
import { Cart } from '@/cart/entities/cart.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string

  @Column()
  name: string

  @Column()
  email: string

  @Column({ name: 'password_hash' })
  passwordHash: string

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role

  @OneToMany(() => Cart, cart => cart.user, { nullable: true })
  carts: Cart[]

  @OneToMany(() => Order, order => order.user)
  orders: Order[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
