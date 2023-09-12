import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'

export class CreatePaymentDto {
  @IsNumber()
  orderId: number

  @IsNumber()
  paymentMethodId: number

  @IsNumber()
  @IsPositive()
  amount: number

  @IsNotEmpty()
  currencyCode: string
}
