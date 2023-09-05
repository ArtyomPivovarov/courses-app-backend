import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Patch,
  Query
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { PaginatedResponse } from '@/common/types/pagination.types'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { ProductPriceService } from '@/product-price/product-price.service'
import { ProductPrice } from '@/product-price/entities/product-price.entity'
import { CreateProductPriceDto } from '@/product-price/dto/create-product-price.dto'
import { UpdateProductPriceDto } from '@/product-price/dto/update-product-price.dto'

@ApiTags('product-prices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product-prices')
export class ProductPriceController {
  constructor(private readonly productPriceService: ProductPriceService) {}

  @ApiOperation({ summary: 'Create product price' })
  @Post()
  create(
    @Body() createProductPriceDto: CreateProductPriceDto
  ): Promise<ProductPrice> {
    return this.productPriceService.create(createProductPriceDto)
  }

  @ApiOperation({ summary: 'Retrieve all product prices' })
  @Get()
  findAll(
    @Query() paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<ProductPrice>> {
    return this.productPriceService.findAll(paginationQueryDto)
  }

  @Patch(':productId/:currencyCode')
  async update(
    @Param('productId') productId: number,
    @Param('currencyCode') currencyCode: string,
    @Body() updateProductPriceDto: UpdateProductPriceDto
  ): Promise<void> {
    await this.productPriceService.update(
      productId,
      currencyCode,
      updateProductPriceDto
    )
  }
}
