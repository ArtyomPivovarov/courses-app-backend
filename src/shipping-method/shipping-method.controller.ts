import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { ShippingMethodService } from './shipping-method.service'
import { CreateShippingMethodDto } from './dto/create-shipping-method.dto'
import { UpdateShippingMethodDto } from './dto/update-shipping-method.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('shipping-methods')
@ApiBearerAuth()
@Controller('shipping-methods')
export class ShippingMethodController {
  constructor(private readonly shippingMethodService: ShippingMethodService) {}

  @ApiOperation({ summary: 'Create shipping method' })
  @Post()
  create(@Body() createShippingMethodDto: CreateShippingMethodDto) {
    return this.shippingMethodService.create(createShippingMethodDto)
  }

  @ApiOperation({ summary: 'Get all shipping methods' })
  @Get()
  findAll() {
    return this.shippingMethodService.findAll()
  }

  @ApiOperation({ summary: 'Get shipping method by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingMethodService.findOne(+id)
  }

  @ApiOperation({ summary: 'Update shipping method by id' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShippingMethodDto: UpdateShippingMethodDto
  ) {
    await this.shippingMethodService.update(+id, updateShippingMethodDto)
  }

  @ApiOperation({ summary: 'Delete shipping method by id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.shippingMethodService.remove(+id)
  }
}
