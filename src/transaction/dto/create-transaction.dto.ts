import { Currency } from '@/common/types/currency.types'
import { User } from '@/user/entities/user.entity'
import { Product } from '@/product/entities/product.entity'

export class CreateTransactionDto {
  amount: number
  currency: Currency
  userId: User['id']
  productId: Product['id']
}
