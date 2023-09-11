import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCartItemDto } from './dto/create-cart-item.dto'
import { UpdateCartItemDto } from './dto/update-cart-item.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { CartItem } from '@/cart-item/entities/cart-item.entity'
import { Repository } from 'typeorm'
import { Cart } from '@/cart/entities/cart.entity'
import { Product } from '@/product/entities/product.entity'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async create(createCartItemDto: CreateCartItemDto) {
    const { cartId, productId, ...rest } = createCartItemDto
    const cart = await this.cartRepository.findOne({
      where: {
        id: cartId
      }
    })
    if (!cart) {
      throw new BadRequestException('Cart not found')
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

    return this.cartItemRepository.save({
      cart: {
        id: cartId
      },
      product: {
        id: productId
      },
      ...rest
    })
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.cartItemRepository.findAndCount({
      select: {
        id: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
        cart: {
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
        cart: {
          user: true
        },
        product: true
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

  async findOne(id: number) {
    const cartItem = await this.cartItemRepository.findOne({
      select: {
        id: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
        cart: {
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
          name: true,
          stock: true
        }
      },
      where: {
        id
      },
      relations: {
        cart: {
          user: true
        },
        product: true
      }
    })
    if (!cartItem) {
      throw new BadRequestException('Cart item not found')
    }

    return cartItem
  }

  async update(id: number, updateCartItemDto: UpdateCartItemDto) {
    const { cartId, productId, ...rest } = updateCartItemDto
    const cartItem = await this.findOne(id)

    if (cartId) {
      const cart = await this.cartRepository.findOne({
        where: {
          id: cartId
        }
      })
      if (!cart) {
        throw new BadRequestException('Cart not found')
      }

      rest['cart'] = { id: cartId }
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

    if (
      rest.quantity &&
      (product?.stock ?? cartItem.product.stock) < rest.quantity
    ) {
      throw new BadRequestException('Product stock is not enough')
    }

    return this.cartItemRepository.update(cartItem.id, rest)
  }

  async delete(id: number) {
    const cartItem = await this.findOne(id)
    return this.cartItemRepository.remove(cartItem)
  }
}
