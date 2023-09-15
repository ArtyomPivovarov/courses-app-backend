import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator'
import { ShippingStatus } from '@/shipping/shipping.types'

export class CreateShippingDto {
  @IsNumber()
  orderId: number

  @IsNumber()
  shippingCarrierId: number

  @IsNumber()
  shippingMethodId: number

  @IsString()
  @MaxLength(300)
  address: string

  @IsNotEmpty()
  @IsEnum(ShippingStatus, { message: 'Invalid shipping status' })
  status: ShippingStatus

  @IsOptional()
  @IsString()
  trackingNumber: string

  @IsNumber()
  shippingFee: number

  @IsDateString()
  estimatedDeliveryDate: Date
}
