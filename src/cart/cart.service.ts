import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCartDto } from './dto/create-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'
import { Cart } from '@/cart/entities/cart.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@/user/entities/user.entity'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { PaginatedResponse } from '@/common/types/pagination.types'

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createCartDto: CreateCartDto) {
    const { userId, ...rest } = createCartDto
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })
    if (!user) {
      throw new BadRequestException('User not found')
    }

    return this.cartRepository.save({
      user: {
        id: userId
      },
      ...rest
    })
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<Cart>> {
    const { page, limit } = paginationQueryDto

    const [items, totalItems] = await this.cartRepository.findAndCount({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          name: true,
          email: true
        }
      },
      relations: {
        user: true
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
    const cart = await this.cartRepository.findOne({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          name: true,
          email: true
        }
      },
      where: {
        id
      },
      relations: {
        user: true
      }
    })
    if (!cart) {
      throw new BadRequestException('Cart not found')
    }

    return cart
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    const cart = await this.findOne(id)
    const { userId, ...rest } = updateCartDto
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })
    if (!user) {
      throw new BadRequestException('User not found')
    }

    return this.cartRepository.update(cart.id, {
      user: {
        id: userId
      },
      ...rest
    })
  }

  async remove(id: number) {
    const cart = await this.findOne(id)
    return this.cartRepository.remove(cart)
  }
}
