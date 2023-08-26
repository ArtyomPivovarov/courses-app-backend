import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards
} from '@nestjs/common'
import { ProductCategoryService } from './product-category.service'
import { CreateProductCategoryDto } from './dto/create-product-category.dto'
import { UpdateProductCategoryDto } from './dto/update-product-category.dto'
import { ProductCategory } from '@/product-category/entities/product-category.entity'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'

@Controller('product-categories')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.create(createProductCategoryDto)
  }

  @Get()
  async findAll() {
    return this.productCategoryService.findAll()
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: ProductCategory['slug']) {
    return this.productCategoryService.findOne(slug)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body()
    updateProductCategoryDto: UpdateProductCategoryDto
  ) {
    await this.productCategoryService.update(id, updateProductCategoryDto)
  }
}
