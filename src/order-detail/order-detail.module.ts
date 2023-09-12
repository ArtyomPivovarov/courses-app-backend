import { Module } from '@nestjs/common'
import { OrderDetailService } from './order-detail.service'
import { OrderDetailController } from './order-detail.controller'
import { OrderDetail } from '@/order-detail/entities/order-detail.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from '@/order/entities/order.entity'
import { Product } from '@/product/entities/product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail, Order, Product])],
  controllers: [OrderDetailController],
  providers: [OrderDetailService]
})
export class OrderDetailModule {}
