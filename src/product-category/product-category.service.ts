import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateProductCategoryDto } from './dto/create-product-category.dto'
import { UpdateProductCategoryDto } from './dto/update-product-category.dto'
import { ProductCategory } from '@/product-category/entities/product-category.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>
  ) {}

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    const product = await this.productCategoryRepository.findOne({
      where: {
        slug: createProductCategoryDto.slug
      }
    })
    if (product) {
      throw new BadRequestException(
        'Product category with this slug already exists'
      )
    }

    return this.productCategoryRepository.save(createProductCategoryDto)
  }

  async findAll() {
    return this.productCategoryRepository.find()
  }

  async findOne(slug: ProductCategory['slug']) {
    const productCategory = await this.productCategoryRepository.findOne({
      where: { slug }
    })
    if (!productCategory) {
      throw new NotFoundException('Product category not found')
    }

    return productCategory
  }

  async update(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    const productCategory = await this.productCategoryRepository.findOne({
      where: { id }
    })
    if (!productCategory) {
      throw new NotFoundException('Product category not found')
    }

    const productCategoryWithNewSlug =
      await this.productCategoryRepository.findOne({
        where: {
          slug: updateProductCategoryDto.slug
        }
      })
    if (productCategoryWithNewSlug) {
      throw new BadRequestException(
        'Product category with this slug already exists'
      )
    }

    return await this.productCategoryRepository.update(
      id,
      updateProductCategoryDto
    )
  }
}
