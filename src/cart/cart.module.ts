import { Module } from '@nestjs/common'
import { CartService } from './cart.service'
import { CartController } from './cart.controller'
import { Cart } from '@/cart/entities/cart.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@/user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Cart, User])],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
