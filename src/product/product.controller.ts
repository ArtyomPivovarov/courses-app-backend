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
import { Role } from '@/role/role.enum'
import { Roles } from '@/role/roles.decorator'
import { RolesGuard } from '@/role/roles.guard'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create product' })
  @ApiBearerAuth()
  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto)
  }

  @ApiOperation({ summary: 'Retrieve all products' })
  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.productService.findAll(paginationQueryDto)
  }

  @ApiOperation({ summary: 'Retrieve a product by slug' })
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.productService.findOne(slug)
  }

  @ApiOperation({ summary: 'Update product by ID' })
  @ApiBearerAuth()
  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    await this.productService.update(+id, updateProductDto)
  }
}
