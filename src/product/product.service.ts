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

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.prices', 'prices')
      .leftJoinAndSelect('prices.currency', 'currency')
      .select([
        'product.id',
        'product.slug',
        'product.isActive',
        'product.name',
        'product.rating',
        'product.createdAt',
        'product.translations',
        'prices.price',
        'currency.code',
        'currency.symbol',
        'category.id',
        'category.slug',
        'category.name',
        'category.translations'
      ])
      .where(onlyActive ? 'product.isActive = :isActive' : '1=1', {
        isActive: onlyActive
      })
      .orderBy('product.rating', 'DESC', 'NULLS LAST')
      .addOrderBy('product.createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)

    const [items, totalItems] = await queryBuilder.getManyAndCount()

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
        category: true,
        prices: true
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
