import { Module } from '@nestjs/common'
import { ShippingMethodService } from './shipping-method.service'
import { ShippingMethodController } from './shipping-method.controller'
import { ShippingMethod } from '@/shipping-method/entities/shipping-method.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([ShippingMethod])],
  controllers: [ShippingMethodController],
  providers: [ShippingMethodService]
})
export class ShippingMethodModule {}
