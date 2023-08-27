import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { PurchaseService } from './purchase.service'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { CreatePurchaseDto } from '@/purchase/dto/create-purchase.dto'
import { Roles } from '@/role/roles.decorator'
import { Role } from '@/role/role.enum'
import { RolesGuard } from '@/role/roles.guard'

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchaseService.create(createPurchaseDto)
  }
}
