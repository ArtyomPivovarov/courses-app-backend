import { Module } from '@nestjs/common'
import { ShippingCarrierService } from './shipping-carrier.service'
import { ShippingCarrierController } from './shipping-carrier.controller'
import { ShippingCarrier } from '@/shipping-carrier/entities/shipping-carrier.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([ShippingCarrier])],
  controllers: [ShippingCarrierController],
  providers: [ShippingCarrierService]
})
export class ShippingCarrierModule {}
