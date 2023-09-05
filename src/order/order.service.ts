import { BadRequestException, Injectable } from '@nestjs/common'
import { Order } from '@/order/entities/order.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateOrderDto } from '@/order/dto/create-order.dto'
import { Repository } from 'typeorm'
import { User } from '@/user/entities/user.entity'
import { Product } from '@/product/entities/product.entity'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { PaginatedResponse } from '@/common/types/pagination.types'
import { UpdateOrderDto } from '@/order/dto/update-order.dto'
import { Transaction } from '@/transaction/entities/transaction.entity'
import { TRANSACTION_NEED_PURCHASE_STATUSES } from '@/order/order.const'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, productId, transactionId, ...rest } = createOrderDto
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
      TRANSACTION_NEED_PURCHASE_STATUSES.includes(createOrderDto.status) &&
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
          order: {
            id: true
          }
        },
        where: {
          id: transactionId
        },
        relations: {
          user: true,
          order: true
        }
      })
      if (!transaction || transaction.user.id !== userId) {
        throw new BadRequestException('Transaction not found')
      }

      if (transaction.order?.id) {
        throw new BadRequestException('Transaction already used')
      }

      if (
        +transaction.amount !==
        rest.quantity * product['price' + transaction.currency]
      ) {
        throw new BadRequestException('Invalid transaction amount')
      }
    }

    return this.orderRepository.save({
      ...rest,
      user: { id: userId },
      product: { id: productId },
      transaction: transactionId ? { id: transactionId } : undefined
    })
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<Order>> {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.orderRepository.findAndCount({
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
          name: true
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

  async findOne(id: Order['id']) {
    const order = await this.orderRepository.findOne({
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
        id
      },
      relations: {
        user: true,
        product: true,
        transaction: true
      }
    })
    if (!order) {
      throw new BadRequestException('Order not found')
    }

    return order
  }

  async findUserOrders(
    userId: User['id'],
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<Order>> {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.orderRepository.findAndCount({
      select: {
        id: true,
        createdAt: true,
        product: {
          id: true,
          slug: true,
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

  async findProductOrders(
    productId: Product['id'],
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<Order>> {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.orderRepository.findAndCount({
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

  async update(id: Order['id'], updateOrderDto: UpdateOrderDto) {
    const { userId, productId, transactionId, ...rest } = updateOrderDto
    const order = await this.orderRepository.findOne({
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
    if (!order) {
      throw new BadRequestException('Order not found')
    }

    const orderUpdatePayload = {}

    if (userId) {
      const user = await this.userRepository.findOne({
        where: {
          id: userId
        }
      })
      if (!user) {
        throw new BadRequestException('User not found')
      }

      orderUpdatePayload['user'] = { id: userId }
    }

    const product = await this.productRepository.findOne({
      where: {
        id: productId || order.product.id
      }
    })

    if (productId) {
      if (!product || product.id !== productId) {
        throw new BadRequestException('Product not found')
      }

      orderUpdatePayload['product'] = { id: productId }
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
      if (!transaction || transaction.user.id !== (userId ?? order.user.id)) {
        throw new BadRequestException('Transaction not found')
      }

      if (transaction.order?.id && transaction.order.id !== id) {
        throw new BadRequestException('Transaction already used')
      }

      if (
        +transaction.amount !==
        rest.quantity * product['price' + transaction.currency]
      ) {
        throw new BadRequestException('Invalid transaction amount')
      }

      orderUpdatePayload['transaction'] = { id: transactionId }
    }

    return await this.orderRepository.update(id, orderUpdatePayload)
  }

  async delete(id: Order['id']) {
    const isExist = await this.orderRepository.findOne({
      where: {
        id
      }
    })
    if (!isExist) {
      throw new BadRequestException('Order not found')
    }

    return await this.orderRepository.delete(id)
  }
}
