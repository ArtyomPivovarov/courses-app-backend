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
import { Transaction } from '@/transaction/entities/transaction.entity'
import { TRANSACTION_NEED_PURCHASE_STATUSES } from '@/purchase/purchase.const'

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto) {
    const { userId, productId, transactionId, ...rest } = createPurchaseDto
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
    if (product.stock < rest.quantity) {
      throw new BadRequestException('Not enough stock')
    }

    if (
      TRANSACTION_NEED_PURCHASE_STATUSES.includes(createPurchaseDto.status) &&
      !transactionId
    ) {
      throw new BadRequestException('Transaction is required')
    }

    if (transactionId) {
      const transaction = await this.transactionRepository.findOne({
        select: {
          id: true,
          amount: true,
          currency: true,
          user: {
            id: true
          },
          purchase: {
            id: true
          }
        },
        where: {
          id: transactionId
        },
        relations: {
          user: true,
          purchase: true
        }
      })
      if (!transaction || transaction.user.id !== userId) {
        throw new BadRequestException('Transaction not found')
      }

      if (transaction.purchase?.id) {
        throw new BadRequestException('Transaction already used')
      }

      if (
        +transaction.amount !==
        rest.quantity * product['price' + transaction.currency]
      ) {
        throw new BadRequestException('Invalid transaction amount')
      }
    }

    return this.purchaseRepository.save({
      ...rest,
      user: { id: userId },
      product: { id: productId },
      transaction: transactionId ? { id: transactionId } : undefined
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
        quantity: true,
        status: true,
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
        },
        transaction: {
          id: true,
          amount: true,
          currency: true,
          createdAt: true
        }
      },
      where: {
        id
      },
      relations: {
        user: true,
        product: true,
        transaction: true
      }
    })
    if (!purchase) {
      throw new BadRequestException('Purchase not found')
    }

    return purchase
  }

  async findUserPurchases(
    userId: User['id'],
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<Purchase>> {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.purchaseRepository.findAndCount({
      select: {
        id: true,
        createdAt: true,
        product: {
          id: true,
          slug: true,
          nameEn: true,
          nameRu: true
        },
        transaction: {
          id: true,
          amount: true,
          currency: true,
          createdAt: true
        }
      },
      where: {
        user: {
          id: userId
        }
      },
      order: {
        createdAt: 'DESC'
      },
      relations: {
        product: true,
        transaction: true
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

  async findProductPurchases(
    productId: Product['id'],
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
        transaction: {
          id: true,
          amount: true,
          currency: true,
          createdAt: true
        }
      },
      where: {
        product: {
          id: productId
        }
      },
      order: {
        createdAt: 'DESC'
      },
      relations: {
        user: true,
        transaction: true
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

  async update(id: Purchase['id'], updatePurchaseDto: UpdatePurchaseDto) {
    const { userId, productId, transactionId, ...rest } = updatePurchaseDto
    const purchase = await this.purchaseRepository.findOne({
      select: {
        id: true,
        user: {
          id: true
        },
        product: {
          id: true
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

    const product = await this.productRepository.findOne({
      where: {
        id: productId || purchase.product.id
      }
    })

    if (productId) {
      if (!product || product.id !== productId) {
        throw new BadRequestException('Product not found')
      }

      purchaseUpdatePayload['product'] = { id: productId }
    }

    if (product.stock < rest.quantity) {
      throw new BadRequestException('Not enough stock')
    }

    if (
      TRANSACTION_NEED_PURCHASE_STATUSES.includes(rest.status) &&
      !transactionId
    ) {
      throw new BadRequestException('Transaction is required')
    }

    if (transactionId) {
      const transaction = await this.transactionRepository.findOne({
        select: {
          id: true,
          amount: true,
          currency: true,
          user: {
            id: true
          }
        },
        where: {
          id: transactionId
        },
        relations: {
          user: true
        }
      })
      if (
        !transaction ||
        transaction.user.id !== (userId ?? purchase.user.id)
      ) {
        throw new BadRequestException('Transaction not found')
      }

      if (transaction.purchase?.id && transaction.purchase.id !== id) {
        throw new BadRequestException('Transaction already used')
      }

      if (
        +transaction.amount !==
        rest.quantity * product['price' + transaction.currency]
      ) {
        throw new BadRequestException('Invalid transaction amount')
      }

      purchaseUpdatePayload['transaction'] = { id: transactionId }
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
