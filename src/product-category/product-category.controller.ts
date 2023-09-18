import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common'
import { ProductCategoryService } from './product-category.service'
import { CreateProductCategoryDto } from './dto/create-product-category.dto'
import { UpdateProductCategoryDto } from './dto/update-product-category.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from '@/auth/public.decorator'

@ApiTags('product-categories')
@Controller('product-categories')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService
  ) {}

  @ApiOperation({
    summary: 'Create product category'
  })
  @ApiBearerAuth()
  @Post()
  async create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.create(createProductCategoryDto)
  }

  @ApiOperation({
    summary: 'Retrieve all product categories'
  })
  @ApiBearerAuth()
  @Get()
  async findAll() {
    return this.productCategoryService.findAll()
  }

  @Public()
  @ApiOperation({
    summary: 'Retrieve a product category by slug'
  })
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.productCategoryService.findOne(slug)
  }

  @ApiOperation({
    summary: 'Update product category by ID'
  })
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body()
    updateProductCategoryDto: UpdateProductCategoryDto
  ) {
    await this.productCategoryService.update(id, updateProductCategoryDto)
  }
}
