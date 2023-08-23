import { Injectable } from '@nestjs/common'
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

  async findAll(): Promise<ProductCategory[]> {
    return this.productCategoryRepository.find()
  }

  async findOne(id: number): Promise<ProductCategory> {
    return this.productCategoryRepository.findOne({ where: { id } })
  }

  async create(
    createProductCategoryDto: CreateProductCategoryDto
  ): Promise<ProductCategory> {
    const productCategory = this.productCategoryRepository.create(
      createProductCategoryDto
    )
    return this.productCategoryRepository.save(productCategory)
  }

  async update(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto
  ): Promise<ProductCategory> {
    await this.productCategoryRepository.update(id, updateProductCategoryDto)
    return this.productCategoryRepository.findOne({ where: { id } })
  }

  async delete(id: number): Promise<void> {
    await this.productCategoryRepository.delete(id)
  }
}
