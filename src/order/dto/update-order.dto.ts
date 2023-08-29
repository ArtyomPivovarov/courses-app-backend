import { CreateOrderDto } from '@/order/dto/create-order.dto'
import { PartialType } from '@nestjs/mapped-types'

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
