import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShippingCarrierService } from './shipping-carrier.service';
import { CreateShippingCarrierDto } from './dto/create-shipping-carrier.dto';
import { UpdateShippingCarrierDto } from './dto/update-shipping-carrier.dto';

@Controller('shipping-carrier')
export class ShippingCarrierController {
  constructor(private readonly shippingCarrierService: ShippingCarrierService) {}

  @Post()
  create(@Body() createShippingCarrierDto: CreateShippingCarrierDto) {
    return this.shippingCarrierService.create(createShippingCarrierDto);
  }

  @Get()
  findAll() {
    return this.shippingCarrierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingCarrierService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShippingCarrierDto: UpdateShippingCarrierDto) {
    return this.shippingCarrierService.update(+id, updateShippingCarrierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shippingCarrierService.remove(+id);
  }
}
