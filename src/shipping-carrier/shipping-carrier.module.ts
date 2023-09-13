import { Module } from '@nestjs/common';
import { ShippingCarrierService } from './shipping-carrier.service';
import { ShippingCarrierController } from './shipping-carrier.controller';

@Module({
  controllers: [ShippingCarrierController],
  providers: [ShippingCarrierService],
})
export class ShippingCarrierModule {}
