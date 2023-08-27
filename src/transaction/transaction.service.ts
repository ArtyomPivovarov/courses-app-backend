import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { Transaction } from './entities/transaction.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@/user/entities/user.entity'
import { Product } from '@/product/entities/product.entity'
import { PaginatedResponse } from '@/common/types/pagination.types'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { UpdateTransactionDto } from '@/transaction/dto/update-transactions.dto'

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const { productId, userId, ...rest } = createTransactionDto
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

    return this.transactionRepository.save({
      ...rest,
      user: { id: userId },
      product: { id: productId }
    })
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<Transaction>> {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.transactionRepository.findAndCount({
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
          nameRu: true,
          priceUsd: true,
          priceRub: true,
          priceBtc: true
        }
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

  async findOne(id: Transaction['id']) {
    const transaction = await this.transactionRepository.findOne({
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
          nameRu: true,
          priceUsd: true,
          priceRub: true,
          priceBtc: true
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
    if (!transaction) {
      throw new BadRequestException('Transaction not found')
    }

    return transaction
  }

  async findUserTransactions(
    userId: User['id'],
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<Transaction>> {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.transactionRepository.findAndCount({
      select: {
        id: true,
        createdAt: true,
        product: {
          id: true,
          slug: true,
          nameEn: true,
          nameRu: true,
          priceUsd: true,
          priceRub: true,
          priceBtc: true
        }
      },
      where: {
        user: { id: userId }
      },
      relations: {
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

  async findProductTransactions(
    productId: Product['id'],
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<Transaction>> {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.transactionRepository.findAndCount({
      select: {
        id: true,
        createdAt: true,
        user: {
          id: true,
          email: true,
          name: true
        }
      },
      where: {
        product: { id: productId }
      },
      relations: {
        user: true
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

  async update(
    id: Transaction['id'],
    updateTransactionDto: UpdateTransactionDto
  ) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id
      }
    })
    if (!transaction) {
      throw new BadRequestException('Transaction not found')
    }

    const { productId, userId, ...rest } = updateTransactionDto
    const transactionUpdatePayload = { ...rest }

    if (productId) {
      const product = await this.productRepository.findOne({
        where: {
          id: productId
        }
      })
      if (!product) {
        throw new BadRequestException('Product not found')
      }

      transactionUpdatePayload['product'] = { id: productId }
    }

    if (userId) {
      const user = await this.userRepository.findOne({
        where: {
          id: userId
        }
      })
      if (!user) {
        throw new BadRequestException('User not found')
      }

      transactionUpdatePayload['user'] = { id: userId }
    }

    return this.transactionRepository.update(id, transactionUpdatePayload)
  }

  async delete(id: Transaction['id']) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id
      }
    })
    if (!transaction) {
      throw new BadRequestException('Transaction not found')
    }

    return this.transactionRepository.delete(id)
  }
}
