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
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { OrderDetailService } from '@/order-detail/order-detail.service'
import { CreateOrderDetailDto } from '@/order-detail/dto/create-order-detail.dto'
import { UpdateOrderDetailDto } from '@/order-detail/dto/update-order-detail.dto'

@ApiTags('order-details')
@Controller('order-details')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @ApiOperation({ summary: 'Create a new order detail' })
  @Post()
  create(@Body() createCartItemDto: CreateOrderDetailDto) {
    return this.orderDetailService.create(createCartItemDto)
  }

  @ApiOperation({ summary: 'Get all cart items' })
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.orderDetailService.findAll(paginationQuery)
  }

  @ApiOperation({ summary: 'Get a order detail by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderDetailService.findOne(+id)
  }

  @ApiOperation({ summary: 'Update a order detail by id' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateOrderDetailDto
  ) {
    await this.orderDetailService.update(+id, updateCartItemDto)
  }

  @ApiOperation({ summary: 'Delete a order detail by id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.orderDetailService.remove(+id)
  }
}
