import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { PaymentMethodService } from './payment-method.service'
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto'
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('payment-methods')
@Controller('payment-methods')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @ApiOperation({ summary: 'Create payment method' })
  @Post()
  create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    return this.paymentMethodService.create(createPaymentMethodDto)
  }

  @ApiOperation({ summary: 'Get all payment methods' })
  @Get()
  findAll() {
    return this.paymentMethodService.findAll()
  }

  @ApiOperation({ summary: 'Get payment method by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentMethodService.findOne(+id)
  }

  @ApiOperation({ summary: 'Update payment method by id' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto
  ) {
    await this.paymentMethodService.update(+id, updatePaymentMethodDto)
  }

  @ApiOperation({ summary: 'Delete payment method by id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.paymentMethodService.remove(+id)
  }
}
