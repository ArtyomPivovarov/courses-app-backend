import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { OrderService } from './order.service'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { CreateOrderDto } from '@/order/dto/create-order.dto'
import { Roles } from '@/role/roles.decorator'
import { Role } from '@/role/role.enum'
import { RolesGuard } from '@/role/roles.guard'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { UpdateOrderDto } from '@/order/dto/update-order.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('orders')
@ApiBearerAuth()
@Roles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto)
  }

  @ApiOperation({ summary: 'Get all orders' })
  @Get()
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.orderService.findAll(paginationQueryDto)
  }

  @ApiOperation({ summary: 'Get an order by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id)
  }

  @ApiOperation({ summary: 'Get all orders by user id' })
  @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: number,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    return this.orderService.findUserOrders(+userId, paginationQueryDto)
  }

  @ApiOperation({ summary: 'Update an order by id' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    await this.orderService.update(+id, updateOrderDto)
  }

  @ApiOperation({ summary: 'Delete an order by id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.orderService.remove(+id)
  }
}
