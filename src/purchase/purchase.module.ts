import { Module } from '@nestjs/common'
import { PurchaseService } from './purchase.service'
import { PurchaseController } from './purchase.controller'
import { Purchase } from '@/purchase/entities/purchase.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from '@/product/entities/product.entity'
import { User } from '@/user/entities/user.entity'
import { Transaction } from '@/transaction/entities/transaction.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Purchase, User, Product, Transaction])],
  controllers: [PurchaseController],
  providers: [PurchaseService]
})
export class PurchaseModule {}
