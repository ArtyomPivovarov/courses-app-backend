import { Test, TestingModule } from '@nestjs/testing';
import { ShippingCarrierController } from './shipping-carrier.controller';
import { ShippingCarrierService } from './shipping-carrier.service';

describe('ShippingCarrierController', () => {
  let controller: ShippingCarrierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingCarrierController],
      providers: [ShippingCarrierService],
    }).compile();

    controller = module.get<ShippingCarrierController>(ShippingCarrierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
