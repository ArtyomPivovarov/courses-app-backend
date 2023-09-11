import { IsNumber, IsPositive } from 'class-validator'

export class CreateCartItemDto {
  @IsNumber()
  cartId: number

  @IsNumber()
  productId: number

  @IsNumber()
  @IsPositive()
  quantity: number
}
