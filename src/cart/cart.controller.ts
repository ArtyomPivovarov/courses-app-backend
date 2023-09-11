import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query
} from '@nestjs/common'
import { CartService } from './cart.service'
import { CreateCartDto } from './dto/create-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { RolesGuard } from '@/role/roles.guard'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'

@ApiTags('carts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto)
  }

  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.cartService.findAll(paginationQueryDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    await this.cartService.update(+id, updateCartDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id)
  }
}
