import { Module } from '@nestjs/common'
import { ShippingCarrierService } from './shipping-carrier.service'
import { ShippingCarrierController } from './shipping-carrier.controller'
import { ShippingCarrier } from '@/shipping-carrier/entities/shipping-carrier.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShippingMethod } from '@/shipping-method/entities/shipping-method.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ShippingCarrier, ShippingMethod])],
  controllers: [ShippingCarrierController],
  providers: [ShippingCarrierService]
})
export class ShippingCarrierModule {}
