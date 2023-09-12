import { BadRequestException, Injectable } from '@nestjs/common'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { Payment } from './entities/payment.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@/user/entities/user.entity'
import { PaginatedResponse } from '@/common/types/pagination.types'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { Order } from '@/order/entities/order.entity'
import { UpdatePaymentDto } from '@/payment/dto/update-payment.dto'

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const { orderId, userId, ...rest } = createPaymentDto
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

    return this.paymentRepository.save({
      ...rest,
      user: { id: userId },
      product: { id: orderId }
    })
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<Payment>> {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.paymentRepository.findAndCount({
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

  async findOne(id: number) {
    const payment = await this.paymentRepository.findOne({
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
    if (!payment) {
      throw new BadRequestException('Payment not found')
    }

    return payment
  }

  async findUserPayments(
    userId: number,
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<Payment>> {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.paymentRepository.findAndCount({
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

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.paymentRepository.findOne({
      where: {
        id
      }
    })
    if (!payment) {
      throw new BadRequestException('Payment not found')
    }

    const { orderId, userId, ...rest } = updatePaymentDto

    if (orderId) {
      const product = await this.orderRepository.findOne({
        where: {
          id: orderId
        }
      })
      if (!product) {
        throw new BadRequestException('Product not found')
      }

      rest['order'] = { id: orderId }
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

    return this.paymentRepository.update(id, rest)
  }

  async remove(id: number) {
    const payment = await this.paymentRepository.findOne({
      where: {
        id
      }
    })
    if (!payment) {
      throw new BadRequestException('Payment not found')
    }

    return this.paymentRepository.delete(id)
  }
}
