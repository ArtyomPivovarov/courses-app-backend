import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateProductPriceDto } from '@/product-price/dto/create-product-price.dto'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { PaginatedResponse } from '@/common/types/pagination.types'
import { UpdateProductPriceDto } from '@/product-price/dto/update-product-price.dto'
import { ProductPrice } from '@/product-price/entities/product-price.entity'

@Injectable()
export class ProductPriceService {
  constructor(
    @InjectRepository(ProductPrice)
    private productPriceRepository: Repository<ProductPrice>
  ) {}

  create(createProductPriceDto: CreateProductPriceDto): Promise<ProductPrice> {
    const product = this.productPriceRepository.findOne({
      where: {
        product: {
          id: createProductPriceDto.productId
        },
        currency: {
          code: createProductPriceDto.currencyCode
        }
      }
    })
    if (product) {
      throw new BadRequestException(
        'Product price with this currency already exists'
      )
    }

    const { productId, currencyCode, ...rest } = createProductPriceDto

    return this.productPriceRepository.save({
      ...rest,
      product: { id: productId },
      currency: { code: currencyCode }
    })
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto
  ): Promise<PaginatedResponse<ProductPrice>> {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.productPriceRepository.findAndCount({
      select: {
        price: true,
        createdAt: true,
        product: {
          id: true,
          slug: true,
          name: true
        },
        currency: {
          code: true,
          symbol: true,
          name: true
        }
      },
      relations: {
        product: true,
        currency: true
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

  async update(
    productId: number,
    currencyCode: string,
    updateProductPriceDto: UpdateProductPriceDto
  ) {
    const price = await this.productPriceRepository.findOne({
      where: {
        product: {
          id: productId
        },
        currency: {
          code: currencyCode
        }
      }
    })
    if (!price) {
      throw new NotFoundException('Product price not found')
    }

    return this.productPriceRepository.save({
      ...price,
      ...updateProductPriceDto
    })
  }
}
