import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Cart } from '@/cart/entities/cart.entity'
import { Product } from '@/product/entities/product.entity'

@Entity()
@Check(`"quantity" > 0`)
export class CartItem {
  @PrimaryGeneratedColumn({ name: 'cart_item_id' })
  id: number

  @ManyToOne(() => Cart, cart => cart.cartItems)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart

  @ManyToOne(() => Product, product => product.cartItems)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @Column('integer')
  quantity: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
