import { IsNotEmpty, IsNumber, IsPositive, ValidateIf } from 'class-validator'
import { PurchaseStatus } from '@/purchase/purchase.types'
import { TRANSACTION_NEED_PURCHASE_STATUSES } from '@/purchase/purchase.const'

export class CreatePurchaseDto {
  @IsNumber()
  userId: number

  @IsNumber()
  productId: number

  @ValidateIf(o => TRANSACTION_NEED_PURCHASE_STATUSES.includes(o.status))
  @IsNumber()
  transactionId?: number

  @IsNotEmpty()
  status: PurchaseStatus

  @IsNumber()
  @IsPositive({ message: 'Quantity must be greater than 0' })
  quantity: number
}
