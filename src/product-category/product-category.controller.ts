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
import { Roles } from '@/role/roles.decorator'
import { Role } from '@/role/role.enum'
import { RolesGuard } from '@/role/roles.guard'
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
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.create(createProductCategoryDto)
  }

  @ApiOperation({
    summary: 'Retrieve all product categories'
  })
  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
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
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async update(
    @Param('id') id: number,
    @Body()
    updateProductCategoryDto: UpdateProductCategoryDto
  ) {
    await this.productCategoryService.update(id, updateProductCategoryDto)
  }
}
