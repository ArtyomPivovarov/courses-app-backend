import { IsNotEmpty, IsNumber, IsPositive, ValidateIf } from 'class-validator'
import { OrderStatus } from '@/order/order.types'
import { TRANSACTION_NEED_PURCHASE_STATUSES } from '@/order/order.const'

export class CreateOrderDto {
  @IsNumber()
  userId: number

  @IsNumber()
  productId: number

  @ValidateIf(o => TRANSACTION_NEED_PURCHASE_STATUSES.includes(o.status))
  @IsNumber()
  transactionId?: number

  @IsNotEmpty()
  status: OrderStatus

  @IsNumber()
  @IsPositive({ message: 'Quantity must be greater than 0' })
  quantity: number
}
