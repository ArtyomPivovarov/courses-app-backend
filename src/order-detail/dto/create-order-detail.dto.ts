import { IsNumber, IsPositive } from 'class-validator'

export class CreateOrderDetailDto {
  @IsNumber()
  orderId: number

  @IsNumber()
  productId: number

  @IsNumber()
  @IsPositive()
  quantity: number

  @IsNumber()
  @IsPositive()
  price: number
}
