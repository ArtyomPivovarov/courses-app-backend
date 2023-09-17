import { Module } from '@nestjs/common'
import { DiscountService } from './discount.service'
import { DiscountController } from './discount.controller'
import { Product } from '@/product/entities/product.entity'
import { Discount } from '@/discount/entities/discount.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Discount, Product])],
  controllers: [DiscountController],
  providers: [DiscountService]
})
export class DiscountModule {}
