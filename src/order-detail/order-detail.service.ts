import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateOrderDetailDto } from './dto/create-order-detail.dto'
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from '@/product/entities/product.entity'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { OrderDetail } from '@/order-detail/entities/order-detail.entity'
import { Order } from '@/order/entities/order.entity'
import { OrderStatus } from '@/order/order.types'

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Order)
    private cartRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async create(createOrderDetailDto: CreateOrderDetailDto) {
    const { orderId, productId, ...rest } = createOrderDetailDto
    const order = await this.cartRepository.findOne({
      where: {
        id: orderId
      }
    })
    if (!order) {
      throw new BadRequestException('Order not found')
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
      throw new BadRequestException('Product stock is not enough')
    }

    const orderDetail = await this.orderDetailRepository.save({
      order: {
        id: orderId
      },
      product: {
        id: productId
      },
      ...rest
    })

    await this.productRepository.update(product.id, {
      stock: product.stock - rest.quantity
    })

    return orderDetail
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.orderDetailRepository.findAndCount({
      select: {
        id: true,
        quantity: true,
        order: {
          id: true,
          createdAt: true,
          updatedAt: true,
          user: {
            id: true,
            name: true,
            email: true
          }
        },
        product: {
          id: true,
          slug: true,
          name: true
        }
      },
      relations: {
        order: {
          user: true
        },
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

  async findOne(id: number) {
    const orderDetail = await this.orderDetailRepository.findOne({
      select: {
        id: true,
        quantity: true,
        order: {
          id: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          user: {
            id: true,
            name: true,
            email: true
          }
        },
        product: {
          id: true,
          slug: true,
          name: true,
          stock: true
        }
      },
      where: {
        id
      },
      relations: {
        order: {
          user: true
        },
        product: true
      }
    })
    if (!orderDetail) {
      throw new BadRequestException('Order item not found')
    }

    return orderDetail
  }

  async update(id: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    const { orderId, productId, ...rest } = updateOrderDetailDto
    const orderDetail = await this.findOne(id)

    if (orderId) {
      const order = await this.cartRepository.findOne({
        where: {
          id: orderId
        }
      })
      if (!order) {
        throw new BadRequestException('Order not found')
      }

      rest['order'] = { id: orderId }
    }

    let product

    if (productId) {
      product = await this.productRepository.findOne({
        where: {
          id: productId
        }
      })
      if (!product) {
        throw new BadRequestException('Product not found')
      }

      rest['product'] = { id: productId }
    }

    if (rest.quantity) {
      if (orderDetail.order.status !== OrderStatus.CREATED) {
        throw new BadRequestException(
          'Cannot update quantity of order item in non-created order'
        )
      }

      const productStock = product?.stock ?? orderDetail.product.stock
      const quantityDelta = rest.quantity - orderDetail.quantity
      if (productStock < quantityDelta) {
        throw new BadRequestException('Product stock is not enough')
      }

      rest['quantity'] = rest.quantity

      await this.productRepository.update(
        product?.id ?? orderDetail.product.id,
        {
          stock: productStock - quantityDelta
        }
      )
    }

    return this.orderDetailRepository.update(orderDetail.id, rest)
  }

  async remove(id: number) {
    const orderDetail = await this.findOne(id)
    await this.productRepository.update(orderDetail.product.id, {
      stock: orderDetail.product.stock + orderDetail.quantity
    })
    return this.orderDetailRepository.remove(orderDetail)
  }
}
