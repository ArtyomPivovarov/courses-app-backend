import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { Product } from '@/product/entities/product.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductCategory } from '@/product-category/entities/product-category.entity'
import { ProductPrice } from '@/product-price/entities/product-price.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategory, ProductPrice])],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
