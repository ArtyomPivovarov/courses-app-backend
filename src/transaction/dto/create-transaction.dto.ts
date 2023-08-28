import { Currency } from '@/common/types/currency.types'
import { User } from '@/user/entities/user.entity'
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'
import { Purchase } from '@/purchase/entities/purchase.entity'

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive({ message: 'Amount must be a positive number' })
  amount: number

  @IsNotEmpty()
  currency: Currency

  @IsNumber()
  userId: User['id']

  @IsNumber()
  purchaseId: Purchase['id']
}
