import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common'
import { ShippingCarrierService } from './shipping-carrier.service'
import { CreateShippingCarrierDto } from './dto/create-shipping-carrier.dto'
import { UpdateShippingCarrierDto } from './dto/update-shipping-carrier.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RolesGuard } from '@/role/roles.guard'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { Roles } from '@/role/roles.decorator'
import { Role } from '@/role/role.enum'

@ApiTags('shipping-carriers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('shipping-carriers')
export class ShippingCarrierController {
  constructor(
    private readonly shippingCarrierService: ShippingCarrierService
  ) {}

  @ApiOperation({ summary: 'Create shipping carrier' })
  @Post()
  create(@Body() createShippingCarrierDto: CreateShippingCarrierDto) {
    return this.shippingCarrierService.create(createShippingCarrierDto)
  }

  @ApiOperation({ summary: 'Get all shipping carriers' })
  @Get()
  findAll() {
    return this.shippingCarrierService.findAll()
  }

  @ApiOperation({ summary: 'Get shipping carrier by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingCarrierService.findOne(+id)
  }

  @ApiOperation({ summary: 'Update shipping carrier by id' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShippingCarrierDto: UpdateShippingCarrierDto
  ) {
    await this.shippingCarrierService.update(+id, updateShippingCarrierDto)
  }

  @ApiOperation({ summary: 'Delete shipping carrier by id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.shippingCarrierService.remove(+id)
  }
}
