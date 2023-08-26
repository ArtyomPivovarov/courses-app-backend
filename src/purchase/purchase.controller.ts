import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { PurchaseService } from './purchase.service'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { CreatePurchaseDto } from '@/purchase/dto/create-purchase.dto'

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchaseService.create(createPurchaseDto)
  }
}
