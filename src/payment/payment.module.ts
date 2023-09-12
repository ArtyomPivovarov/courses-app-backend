import { Module } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Payment } from './entities/payment.entity'
import { Order } from '@/order/entities/order.entity'
import { PaymentMethod } from '@/payment-method/entities/payment-method.entity'
import { Currency } from '@/currency/entities/currency.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentMethod, Currency, Order])
  ],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
