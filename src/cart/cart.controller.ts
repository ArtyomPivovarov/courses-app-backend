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
import { CartService } from './cart.service'
import { CreateCartDto } from './dto/create-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'

@ApiTags('carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Create a new cart' })
  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto)
  }

  @ApiOperation({ summary: 'Get all carts' })
  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.cartService.findAll(paginationQueryDto)
  }

  @ApiOperation({ summary: 'Get a cart by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id)
  }

  @ApiOperation({ summary: 'Update a cart by id' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    await this.cartService.update(+id, updateCartDto)
  }

  @ApiOperation({ summary: 'Delete a cart by id' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id)
  }
}
