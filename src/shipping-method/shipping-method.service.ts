import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateShippingMethodDto } from './dto/create-shipping-method.dto'
import { UpdateShippingMethodDto } from './dto/update-shipping-method.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ShippingMethod } from '@/shipping-method/entities/shipping-method.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ShippingMethodService {
  constructor(
    @InjectRepository(ShippingMethod)
    private shippingMethodRepository: Repository<ShippingMethod>
  ) {}
  async create(createShippingMethodDto: CreateShippingMethodDto) {
    const shippingMethod = await this.shippingMethodRepository.findOne({
      where: { name: createShippingMethodDto.name }
    })
    if (shippingMethod) {
      throw new BadRequestException(
        'Shipping method with this name already exists'
      )
    }

    return this.shippingMethodRepository.save(createShippingMethodDto)
  }

  findAll() {
    return this.shippingMethodRepository.find()
  }

  async findOne(id: number) {
    const shippingMethod = await this.shippingMethodRepository.findOne({
      where: { id }
    })
    if (!shippingMethod) {
      throw new NotFoundException('Shipping method not found')
    }

    return shippingMethod
  }

  async update(id: number, updateShippingMethodDto: UpdateShippingMethodDto) {
    const shippingMethod = await this.findOne(id)
    return this.shippingMethodRepository.update(
      shippingMethod.id,
      updateShippingMethodDto
    )
  }

  async remove(id: number) {
    const shippingMethod = await this.findOne(id)
    return this.shippingMethodRepository.remove(shippingMethod)
  }
}
