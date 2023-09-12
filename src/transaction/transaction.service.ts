import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { Transaction } from './entities/transaction.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@/user/entities/user.entity'
import { PaginatedResponse } from '@/common/types/pagination.types'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { Order } from '@/order/entities/order.entity'
import { UpdateTransactionDto } from '@/transaction/dto/update-transactions.dto'

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const { orderId, userId, ...rest } = createTransactionDto
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })
    if (!user) {
      throw new BadRequestException('User not found')
    }

    const order = await this.orderRepository.findOne({
      where: {
        id: orderId
      }
    })
    if (!order) {
      throw new BadRequestException('Product not found')
    }

    return this.transactionRepository.save({
      ...rest,
      user: { id: userId },
      product: { id: orderId }
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
        order: {
          id: true,
          status: true,
          createdAt: true
        }
      },
      relations: {
        user: true,
        order: true
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
        order: {
          id: true,
          status: true,
          createdAt: true
        }
      },
      where: {
        id
      },
      relations: {
        user: true,
        order: true
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
        order: {
          id: true,
          createdAt: true,
          status: true
        }
      },
      where: {
        user: { id: userId }
      },
      relations: {
        order: true
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

    const { orderId, userId, ...rest } = updateTransactionDto
    const transactionUpdatePayload = { ...rest }

    if (orderId) {
      const product = await this.orderRepository.findOne({
        where: {
          id: orderId
        }
      })
      if (!product) {
        throw new BadRequestException('Product not found')
      }

      transactionUpdatePayload['order'] = { id: orderId }
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

  async remove(id: Transaction['id']) {
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
