import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator'
import { OrderStatus } from '@/order/order.types'

export class CreateOrderDto {
  @IsNumber()
  userId: number

  @IsNotEmpty()
  @IsEnum(OrderStatus, { message: 'Invalid order status' })
  status: OrderStatus

  @IsNumber()
  @IsPositive()
  totalPrice: number
}
