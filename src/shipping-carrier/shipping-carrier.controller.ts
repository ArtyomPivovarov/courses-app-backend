import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { ShippingCarrierService } from './shipping-carrier.service'
import { CreateShippingCarrierDto } from './dto/create-shipping-carrier.dto'
import { UpdateShippingCarrierDto } from './dto/update-shipping-carrier.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('shipping-carriers')
@Controller('shipping-carriers')
export class ShippingCarrierController {
  constructor(
    private readonly shippingCarrierService: ShippingCarrierService
  ) {}

  @ApiOperation({ summary: 'Create shipping carrier' })
  @Post()
  create(@Body() createShippingCarrierDto: CreateShippingCarrierDto) {
    return this.shippingCarrierService.create(createShippingCarrierDto)
  }

  @ApiOperation({ summary: 'Get all shipping carriers' })
  @Get()
  findAll() {
    return this.shippingCarrierService.findAll()
  }

  @ApiOperation({ summary: 'Get shipping carrier by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingCarrierService.findOne(+id)
  }

  @ApiOperation({ summary: 'Update shipping carrier by id' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShippingCarrierDto: UpdateShippingCarrierDto
  ) {
    await this.shippingCarrierService.update(+id, updateShippingCarrierDto)
  }

  @ApiOperation({ summary: 'Delete shipping carrier by id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.shippingCarrierService.remove(+id)
  }
}
