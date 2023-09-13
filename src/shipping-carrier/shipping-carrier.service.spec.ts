import { Test, TestingModule } from '@nestjs/testing';
import { ShippingCarrierService } from './shipping-carrier.service';

describe('ShippingCarrierService', () => {
  let service: ShippingCarrierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShippingCarrierService],
    }).compile();

    service = module.get<ShippingCarrierService>(ShippingCarrierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
