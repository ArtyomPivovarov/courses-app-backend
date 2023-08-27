import { BadRequestException, Injectable } from '@nestjs/common'
import { Purchase } from '@/purchase/entities/purchase.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { CreatePurchaseDto } from '@/purchase/dto/create-purchase.dto'
import { Repository } from 'typeorm'
import { User } from '@/user/entities/user.entity'
import { Product } from '@/product/entities/product.entity'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { PaginatedResponse } from '@/common/types/pagination.types'
import { UpdatePurchaseDto } from '@/purchase/dto/update-purchase.dto'

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

  async findAll(
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<Purchase>> {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.purchaseRepository.findAndCount({
      select: {
        id: true,
        createdAt: true,
        user: {
          id: true,
          email: true,
          name: true
        },
        product: {
          id: true,
          slug: true,
          nameEn: true,
          nameRu: true
        }
      },
      order: {
        createdAt: 'DESC'
      },
      relations: {
        user: true,
        product: true
      },
      take: limit,
      skip: (page - 1) * limit
    })

    return {
      items,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    }
  }

  async findOne(id: Purchase['id']) {
    const purchase = await this.purchaseRepository.findOne({
      select: {
        id: true,
        createdAt: true,
        user: {
          id: true,
          email: true,
          name: true
        },
        product: {
          id: true,
          slug: true,
          nameEn: true,
          nameRu: true
        }
      },
      where: {
        id
      },
      relations: {
        user: true,
        product: true
      }
    })
    if (!purchase) {
      throw new BadRequestException('Purchase not found')
    }

    return purchase
  }

  async update(id: Purchase['id'], updatePurchaseDto: UpdatePurchaseDto) {
    const { userId, productId } = updatePurchaseDto
    const isExist = await this.purchaseRepository.findOne({
      where: {
        id
      }
    })
    if (!isExist) {
      throw new BadRequestException('Purchase not found')
    }

    const purchaseUpdatePayload = {}

    if (userId) {
      const user = await this.userRepository.findOne({
        where: {
          id: userId
        }
      })
      if (!user) {
        throw new BadRequestException('User not found')
      }

      purchaseUpdatePayload['user'] = { id: userId }
    }

    if (productId) {
      const product = await this.productRepository.findOne({
        where: {
          id: productId
        }
      })
      if (!product) {
        throw new BadRequestException('Product not found')
      }

      purchaseUpdatePayload['product'] = { id: productId }
    }

    return await this.purchaseRepository.update(id, purchaseUpdatePayload)
  }

  async delete(id: Purchase['id']) {
    const isExist = await this.purchaseRepository.findOne({
      where: {
        id
      }
    })
    if (!isExist) {
      throw new BadRequestException('Purchase not found')
    }

    return await this.purchaseRepository.delete(id)
  }
}
