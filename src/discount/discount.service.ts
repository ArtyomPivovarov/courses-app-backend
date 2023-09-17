import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateDiscountDto } from './dto/create-discount.dto'
import { UpdateDiscountDto } from './dto/update-discount.dto'
import { Discount } from '@/discount/entities/discount.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Product } from '@/product/entities/product.entity'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { PaginatedResponse } from '@/common/types/pagination.types'

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}
  async create(createDiscountDto: CreateDiscountDto) {
    const products = await this.productRepository.find({
      where: { id: In(createDiscountDto.productIds) }
    })
    if (products.length !== createDiscountDto.productIds.length) {
      throw new BadRequestException('Some products do not exist')
    }

    return this.discountRepository.save({
      ...createDiscountDto,
      products
    })
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<Discount>> {
    const { limit, page } = paginationQueryDto

    const [items, totalItems] = await this.discountRepository.findAndCount({
      select: {
        id: true,
        name: true,
        discountPercentage: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        translations: {
          select: {
            name: true,
            description: true
          }
        },
        products: {
          id: true,
          name: true,
          slug: true
        }
      },
      relations: {
        products: true
      },
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' }
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
    const discount = await this.discountRepository.findOne({
      where: { id },
      relations: {
        products: true
      }
    })
    if (!discount) {
      throw new BadRequestException('Discount does not exist')
    }

    return discount
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
    const discount = await this.findOne(id)
    const { productIds, ...rest } = updateDiscountDto

    if (productIds) {
      const products = await this.productRepository.find({
        where: { id: In(productIds) }
      })
      if (products.length !== productIds.length) {
        throw new BadRequestException('Some products do not exist')
      }

      rest['products'] = products
    }

    return this.discountRepository.update(discount.id, rest)
  }

  async remove(id: number) {
    const discount = await this.findOne(id)
    return this.discountRepository.remove(discount)
  }
}
