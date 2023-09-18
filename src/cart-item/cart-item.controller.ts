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
import { CartItemService } from './cart-item.service'
import { CreateCartItemDto } from './dto/create-cart-item.dto'
import { UpdateCartItemDto } from './dto/update-cart-item.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'

@ApiTags('cart-items')
@ApiBearerAuth()
@Controller('cart-items')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @ApiOperation({ summary: 'Create a new cart item' })
  @Post()
  create(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemService.create(createCartItemDto)
  }

  @ApiOperation({ summary: 'Get all cart items' })
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.cartItemService.findAll(paginationQuery)
  }

  @ApiOperation({ summary: 'Get a cart item by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartItemService.findOne(+id)
  }

  @ApiOperation({ summary: 'Update a cart item by id' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    await this.cartItemService.update(+id, updateCartItemDto)
  }

  @ApiOperation({ summary: 'Delete a cart item by id' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartItemService.remove(+id)
  }
}
