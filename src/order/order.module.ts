import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { Order } from '@/order/entities/order.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from '@/product/entities/product.entity'
import { User } from '@/user/entities/user.entity'
import { Transaction } from '@/transaction/entities/transaction.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Product, Transaction])],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
