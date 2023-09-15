import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateShippingDto } from './dto/create-shipping.dto'
import { UpdateShippingDto } from './dto/update-shipping.dto'
import { Shipping } from '@/shipping/entities/shipping.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ShippingCarrier } from '@/shipping-carrier/entities/shipping-carrier.entity'
import { ShippingMethod } from '@/shipping-method/entities/shipping-method.entity'
import { Order } from '@/order/entities/order.entity'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { PaginatedResponse } from '@/common/types/pagination.types'

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(Shipping)
    private readonly shippingRepository: Repository<Shipping>,
    @InjectRepository(ShippingCarrier)
    private readonly shippingCarrierRepository: Repository<ShippingCarrier>,
    @InjectRepository(ShippingMethod)
    private readonly shippingMethodRepository: Repository<ShippingMethod>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) {}
  async create(createShippingDto: CreateShippingDto) {
    const { orderId, shippingCarrierId, shippingMethodId, ...rest } =
      createShippingDto
    const order = await this.orderRepository.findOne({
      where: { id: orderId }
    })
    if (!order) {
      throw new BadRequestException('Order not found')
    }

    const shippingCarrier = await this.shippingCarrierRepository.findOne({
      where: { id: shippingCarrierId },
      relations: {
        shippingMethods: true
      }
    })
    if (!shippingCarrier) {
      throw new BadRequestException('Shipping carrier not found')
    }
    if (!shippingCarrier.isActive) {
      throw new BadRequestException('Shipping carrier is not active')
    }

    const shippingMethod = shippingCarrier.shippingMethods.find(
      shippingMethod => shippingMethod.id === shippingMethodId
    )
    if (!shippingMethod) {
      throw new BadRequestException(
        'This shipping method is not supported by the carrier'
      )
    }

    return this.shippingRepository.save({
      order,
      shippingCarrier,
      shippingMethod,
      ...rest
    })
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<Shipping>> {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.shippingRepository.findAndCount({
      select: {
        id: true,
        address: true,
        status: true,
        trackingNumber: true,
        shippingFee: true,
        estimatedDeliveryDate: true,
        createdAt: true,
        updatedAt: true,
        order: {
          id: true,
          totalPrice: true,
          status: true
        },
        shippingCarrier: {
          id: true,
          name: true
        },
        shippingMethod: {
          id: true,
          name: true
        }
      },
      order: {
        createdAt: 'DESC'
      },
      relations: {
        order: true,
        shippingCarrier: true,
        shippingMethod: true
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
    const shipping = await this.shippingRepository.findOne({
      select: {
        id: true,
        address: true,
        status: true,
        trackingNumber: true,
        shippingFee: true,
        estimatedDeliveryDate: true,
        createdAt: true,
        updatedAt: true,
        order: {
          id: true,
          totalPrice: true,
          status: true
        },
        shippingCarrier: {
          id: true,
          name: true
        },
        shippingMethod: {
          id: true,
          name: true
        }
      },
      order: {
        createdAt: 'DESC'
      },
      relations: {
        order: true,
        shippingCarrier: true,
        shippingMethod: true
      },
      where: { id }
    })
    if (!shipping) {
      throw new NotFoundException('Shipping not found')
    }

    return shipping
  }

  async update(id: number, updateShippingDto: UpdateShippingDto) {
    const shipping = await this.findOne(id)
    const { orderId, shippingCarrierId, shippingMethodId, ...rest } =
      updateShippingDto

    if (orderId) {
      const order = await this.orderRepository.findOne({
        where: { id: orderId }
      })
      if (!order) {
        throw new BadRequestException('Order not found')
      }

      rest['order'] = order
    }

    if (shippingCarrierId) {
      const shippingCarrier = await this.shippingCarrierRepository.findOne({
        where: { id: shippingCarrierId },
        relations: {
          shippingMethods: true
        }
      })
      if (!shippingCarrier) {
        throw new BadRequestException('Shipping carrier not found')
      }
      if (!shippingCarrier.isActive) {
        throw new BadRequestException('Shipping carrier is not active')
      }

      const shippingMethod = shippingCarrier.shippingMethods.find(
        el => el.id === shippingMethodId ?? shipping.shippingMethod.id
      )
      if (!shippingMethod) {
        throw new BadRequestException(
          'This shipping method is not supported by the carrier'
        )
      }

      rest['shippingCarrier'] = shippingCarrier
      rest['shippingMethod'] = shippingMethod
    }

    return this.shippingRepository.update(id, rest)
  }

  async remove(id: number) {
    const shipping = await this.findOne(id)
    return this.shippingRepository.remove(shipping)
  }
}
