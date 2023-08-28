import { Module } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { TransactionController } from './transaction.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from './entities/transaction.entity'
import { User } from '@/user/entities/user.entity'
import { Purchase } from '@/purchase/entities/purchase.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User, Purchase])],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
