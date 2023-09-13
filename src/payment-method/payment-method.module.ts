import { Module } from '@nestjs/common'
import { PaymentMethodService } from './payment-method.service'
import { PaymentMethodController } from './payment-method.controller'
import { PaymentMethod } from '@/payment-method/entities/payment-method.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService]
})
export class PaymentMethodModule {}
