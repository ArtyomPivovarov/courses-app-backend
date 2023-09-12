import { BadRequestException, Injectable } from '@nestjs/common'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { Payment } from './entities/payment.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PaginatedResponse } from '@/common/types/pagination.types'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { Order } from '@/order/entities/order.entity'
import { PaymentMethod } from '@/payment-method/entities/payment-method.entity'
import { Currency } from '@/currency/entities/currency.entity'

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const { orderId, currencyCode, paymentMethodId, ...rest } = createPaymentDto
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId
      }
    })
    if (!order) {
      throw new BadRequestException('Order not found')
    }

    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: {
        id: paymentMethodId
      }
    })
    if (!paymentMethod) {
      throw new BadRequestException('Payment method not found')
    }

    const currency = await this.currencyRepository.findOne({
      where: {
        code: currencyCode
      }
    })
    if (!currency) {
      throw new BadRequestException('Currency not found')
    }

    return this.paymentRepository.save({
      ...rest,
      order: { id: orderId },
      currency: { code: currencyCode },
      paymentMethod: { id: paymentMethodId }
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
        amount: true,
        order: {
          id: true,
          status: true,
          createdAt: true
        },
        paymentMethod: {
          id: true,
          name: true
        },
        currency: {
          code: true
        }
      },
      relations: {
        order: true,
        paymentMethod: true,
        currency: true
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
        amount: true,
        order: {
          id: true,
          status: true,
          createdAt: true
        },
        paymentMethod: {
          id: true,
          name: true
        },
        currency: {
          code: true
        }
      },
      where: {
        id
      },
      relations: {
        paymentMethod: true,
        order: true,
        currency: true
      }
    })
    if (!payment) {
      throw new BadRequestException('Payment not found')
    }

    return payment
  }
}
