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

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto)
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.orderService.findAll(paginationQueryDto)
  }

  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id)
  }

  @Get('user/:userId')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findByUser(
    @Param('userId') userId: number,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    return this.orderService.findUserOrders(+userId, paginationQueryDto)
  }

  @Get('product/:productId')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findByProduct(
    @Param('productId') productId: number,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    return this.orderService.findProductOrders(+productId, paginationQueryDto)
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    await this.orderService.update(+id, updateOrderDto)
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: string) {
    await this.orderService.remove(+id)
  }
}
