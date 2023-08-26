import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards
} from '@nestjs/common'
import { ProductService } from './product.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto)
  }

  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.productService.findAll(paginationQueryDto)
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.productService.findOne(slug)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    await this.productService.update(+id, updateProductDto)
  }
}
