import { Module } from '@nestjs/common'
import { CartItemService } from './cart-item.service'
import { CartItemController } from './cart-item.controller'
import { CartItem } from '@/cart-item/entities/cart-item.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cart } from '@/cart/entities/cart.entity'
import { Product } from '@/product/entities/product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Cart, Product])],
  controllers: [CartItemController],
  providers: [CartItemService]
})
export class CartItemModule {}
