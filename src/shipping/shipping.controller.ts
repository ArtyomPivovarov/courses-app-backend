import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query
} from '@nestjs/common'
import { ShippingService } from './shipping.service'
import { CreateShippingDto } from './dto/create-shipping.dto'
import { UpdateShippingDto } from './dto/update-shipping.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'

@ApiTags('shippings')
@Controller('shippings')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @ApiOperation({ summary: 'Create shipping' })
  @Post()
  create(@Body() createShippingDto: CreateShippingDto) {
    return this.shippingService.create(createShippingDto)
  }

  @ApiOperation({ summary: 'Find all shippings' })
  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.shippingService.findAll(paginationQueryDto)
  }

  @ApiOperation({ summary: 'Find one shipping' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingService.findOne(+id)
  }

  @ApiOperation({ summary: 'Update shipping' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShippingDto: UpdateShippingDto
  ) {
    await this.shippingService.update(+id, updateShippingDto)
  }

  @ApiOperation({ summary: 'Remove shipping' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.shippingService.remove(+id)
  }
}
