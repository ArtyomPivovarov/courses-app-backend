import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from '@/product/entities/product.entity'
import { Repository } from 'typeorm'
import { ProductCategory } from '@/product-category/entities/product-category.entity'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { PaginatedResponse } from '@/common/types/pagination.types'
import { ProductListItem } from '@/product/product.types'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productRepository.findOne({
      where: {
        slug: createProductDto.slug
      }
    })
    if (product) {
      throw new BadRequestException('Product with this slug already exists')
    }

    const { categoryId, ...rest } = createProductDto
    const productCategory = await this.productCategoryRepository.findOne({
      where: {
        id: categoryId
      }
    })
    if (!productCategory) {
      throw new BadRequestException('Product category not found')
    }

    return this.productRepository.save({
      ...rest,
      category: { id: categoryId }
    })
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
    onlyActive: boolean = true
  ): Promise<PaginatedResponse<ProductListItem>> {
    const { page, limit } = paginationQueryDto
    const [items, totalItems] = await this.productRepository.findAndCount({
      select: {
        id: true,
        slug: true,
        isActive: true,
        nameEn: true,
        nameRu: true,
        priceUSD: true,
        priceRUB: true,
        priceBTC: true,
        rating: true,
        createdAt: true,
        category: {
          id: true,
          slug: true,
          nameEn: true,
          nameRu: true
        }
      },
      where: onlyActive ? { isActive: true } : {},
      order: {
        rating: {
          direction: 'DESC',
          nulls: 'LAST'
        },
        createdAt: 'DESC'
      },
      relations: {
        category: true
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

  async findOne(slug: Product['slug']) {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: {
        category: true
      }
    })
    if (!product) {
      throw new NotFoundException('Product not found')
    }

    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id }
    })
    if (!product) {
      throw new NotFoundException('Product not found')
    }

    if (updateProductDto.slug) {
      const productWithNewSlug = await this.productRepository.findOne({
        where: {
          slug: updateProductDto.slug
        }
      })
      if (productWithNewSlug) {
        throw new BadRequestException('Product with this slug already exists')
      }
    }

    const { categoryId, ...rest } = updateProductDto

    if (categoryId) {
      const productCategory = await this.productCategoryRepository.findOne({
        where: {
          id: categoryId
        }
      })
      if (!productCategory) {
        throw new BadRequestException('Product category not found')
      }
    }

    return await this.productRepository.update(
      id,
      categoryId
        ? {
            ...rest,
            category: { id: categoryId }
          }
        : rest
    )
  }
}
