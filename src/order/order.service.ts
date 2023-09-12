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
    const { userId, ...rest } = createOrderDto
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })
    if (!user) {
      throw new BadRequestException('User not found')
    }

    return this.orderRepository.save({
      ...rest,
      user: { id: userId }
    })
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<Order>> {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.orderRepository.findAndCount({
      select: {
        id: true,
        status: true,
        createdAt: true,
        user: {
          id: true,
          email: true,
          name: true
        }
      },
      order: {
        createdAt: 'DESC'
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

  async findOne(id: Order['id']) {
    const order = await this.orderRepository.findOne({
      select: {
        id: true,
        createdAt: true,
        status: true,
        user: {
          id: true,
          email: true,
          name: true
        }
      },
      where: {
        id
      },
      relations: {
        user: true
      }
    })
    if (!order) {
      throw new BadRequestException('Order not found')
    }

    return order
  }

  async findUserOrders(
    userId: number,
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<Order>> {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.orderRepository.findAndCount({
      select: {
        id: true,
        status: true,
        createdAt: true
      },
      where: {
        user: {
          id: userId
        }
      },
      order: {
        createdAt: 'DESC'
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

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const { userId, ...rest } = updateOrderDto
    const order = await this.orderRepository.findOne({
      select: {
        id: true
      },
      where: {
        id
      },
      relations: {
        user: true
      }
    })
    if (!order) {
      throw new BadRequestException('Order not found')
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

      rest['user'] = { id: userId }
    }

    return await this.orderRepository.update(id, rest)
  }

  async remove(id: number) {
    const order = await this.findOne(id)
    return this.orderRepository.delete(order.id)
  }
}
