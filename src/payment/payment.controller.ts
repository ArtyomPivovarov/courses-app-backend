import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query,
  Patch,
  Delete
} from '@nestjs/common'
import { PaymentService } from './payment.service'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { Roles } from '@/role/roles.decorator'
import { Role } from '@/role/role.enum'
import { RolesGuard } from '@/role/roles.guard'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { UpdatePaymentDto } from '@/payment/dto/update-payment.dto'
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

  @ApiOperation({ summary: 'Get payments by user' })
  @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: number,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    return this.paymentService.findUserPayments(+userId, paginationQueryDto)
  }

  @ApiOperation({ summary: 'Get payments by order' })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    await this.paymentService.update(+id, updatePaymentDto)
  }

  @ApiOperation({ summary: 'Delete payment by id' })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.paymentService.remove(+id)
  }
}
