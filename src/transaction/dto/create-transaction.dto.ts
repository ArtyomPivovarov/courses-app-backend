import { Currency } from '@/common/types/currency.types'
import { User } from '@/user/entities/user.entity'
import { Product } from '@/product/entities/product.entity'
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive({ message: 'Amount must be a positive number' })
  amount: number

  @IsNotEmpty()
  currency: Currency

  @IsNumber()
  userId: User['id']

  @IsNumber()
  productId: Product['id']
}
