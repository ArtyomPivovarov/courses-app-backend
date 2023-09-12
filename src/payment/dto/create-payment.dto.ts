import { User } from '@/user/entities/user.entity'
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'
import { Order } from '@/order/entities/order.entity'
import { Currency } from '@/currency/entities/currency.entity'

export class CreatePaymentDto {
  @IsNumber()
  @IsPositive({ message: 'Amount must be a positive number' })
  amount: number

  @IsNotEmpty()
  currency: Currency

  @IsNumber()
  userId: User['id']

  @IsNumber()
  orderId: Order['id']
}
