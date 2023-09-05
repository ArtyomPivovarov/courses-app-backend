import { PickType } from '@nestjs/swagger'
import { CreateProductPriceDto } from './create-product-price.dto'

export class UpdateProductPriceDto extends PickType(CreateProductPriceDto, [
  'price'
]) {}
