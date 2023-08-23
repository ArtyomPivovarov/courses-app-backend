import { Injectable } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from '@/product/entities/product.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find()
  }

  async findOne(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id } })
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto)
    return this.productRepository.save(product)
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    await this.productRepository.update(id, updateProductDto)
    return this.productRepository.findOne({ where: { id } })
  }

  async delete(id: number): Promise<void> {
    await this.productRepository.delete(id)
  }
}
