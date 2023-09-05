import { Module } from '@nestjs/common'
import { ProductPriceService } from './product-price.service'
import { ProductPriceController } from './product-price.controller'
import { ProductPrice } from '@/product-price/entities/product-price.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from '@/product/entities/product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ProductPrice, Product])],
  controllers: [ProductPriceController],
  providers: [ProductPriceService]
})
export class ProductPriceModule {}
