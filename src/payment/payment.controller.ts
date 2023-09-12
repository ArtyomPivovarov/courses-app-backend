import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query
} from '@nestjs/common'
import { PaymentService } from './payment.service'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { Roles } from '@/role/roles.decorator'
import { Role } from '@/role/role.enum'
import { RolesGuard } from '@/role/roles.guard'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Create payment' })
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto)
  }

  @ApiOperation({ summary: 'Get all payments' })
  @Get()
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.paymentService.findAll(paginationQueryDto)
  }

  @ApiOperation({ summary: 'Get payment by id' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.paymentService.findOne(+id)
  }
}
