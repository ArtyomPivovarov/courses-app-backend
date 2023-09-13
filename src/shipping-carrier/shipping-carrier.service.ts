import { Injectable } from '@nestjs/common';
import { CreateShippingCarrierDto } from './dto/create-shipping-carrier.dto';
import { UpdateShippingCarrierDto } from './dto/update-shipping-carrier.dto';

@Injectable()
export class ShippingCarrierService {
  create(createShippingCarrierDto: CreateShippingCarrierDto) {
    return 'This action adds a new shippingCarrier';
  }

  findAll() {
    return `This action returns all shippingCarrier`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shippingCarrier`;
  }

  update(id: number, updateShippingCarrierDto: UpdateShippingCarrierDto) {
    return `This action updates a #${id} shippingCarrier`;
  }

  remove(id: number) {
    return `This action removes a #${id} shippingCarrier`;
  }
}
