import { BadRequestException, Injectable } from '@nestjs/common'
import { Purchase } from '@/purchase/entities/purchase.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { CreatePurchaseDto } from '@/purchase/dto/create-purchase.dto'
import { Repository } from 'typeorm'
import { User } from '@/user/entities/user.entity'
import { Product } from '@/product/entities/product.entity'

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto) {
    const { userId, productId, ...rest } = createPurchaseDto
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })
    if (!user) {
      throw new BadRequestException('User not found')
    }

    const product = await this.productRepository.findOne({
      where: {
        id: productId
      }
    })
    if (!product) {
      throw new BadRequestException('Product not found')
    }

    return this.purchaseRepository.save({
      ...rest,
      user: { id: userId },
      product: { id: productId }
    })
  }
}
