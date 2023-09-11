import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from '@/user/entities/user.entity'
import { CartItem } from '@/cart-item/entities/cart-item.entity'

@Entity()
export class Cart {
  @PrimaryGeneratedColumn({ name: 'cart_id' })
  id: number

  @ManyToOne(() => User, user => user.carts)
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToMany(() => CartItem, cartItem => cartItem.cart)
  cartItems: CartItem[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
