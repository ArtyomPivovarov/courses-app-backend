import { Module } from '@nestjs/common'
import { ShippingService } from './shipping.service'
import { ShippingController } from './shipping.controller'
import { ShippingMethod } from '@/shipping-method/entities/shipping-method.entity'
import { ShippingCarrier } from '@/shipping-carrier/entities/shipping-carrier.entity'
import { Shipping } from '@/shipping/entities/shipping.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from '@/order/entities/order.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Shipping, ShippingCarrier, ShippingMethod, Order])
  ],
  controllers: [ShippingController],
  providers: [ShippingService]
})
export class ShippingModule {}
