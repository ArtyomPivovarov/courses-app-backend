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
import { DiscountService } from './discount.service'
import { CreateDiscountDto } from './dto/create-discount.dto'
import { UpdateDiscountDto } from './dto/update-discount.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RolesGuard } from '@/role/roles.guard'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { Roles } from '@/role/roles.decorator'
import { Role } from '@/role/role.enum'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'

@ApiTags('discounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @ApiOperation({ summary: 'Create discount' })
  @Post()
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto)
  }

  @ApiOperation({ summary: 'Get all discounts' })
  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.discountService.findAll(paginationQueryDto)
  }

  @ApiOperation({ summary: 'Get discount by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountService.findOne(+id)
  }

  @ApiOperation({ summary: 'Update discount by id' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto
  ) {
    await this.discountService.update(+id, updateDiscountDto)
  }

  @ApiOperation({ summary: 'Delete discount by id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.discountService.remove(+id)
  }
}
