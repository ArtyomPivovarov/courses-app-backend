import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateShippingCarrierDto } from './dto/create-shipping-carrier.dto'
import { UpdateShippingCarrierDto } from './dto/update-shipping-carrier.dto'
import { ShippingCarrier } from '@/shipping-carrier/entities/shipping-carrier.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ShippingCarrierService {
  constructor(
    @InjectRepository(ShippingCarrier)
    private readonly shippingCarrierRepository: Repository<ShippingCarrier>
  ) {}
  async create(createShippingCarrierDto: CreateShippingCarrierDto) {
    const shippingCarrier = await this.shippingCarrierRepository.findOne({
      where: {
        name: createShippingCarrierDto.name
      }
    })
    if (shippingCarrier) {
      throw new BadRequestException('Shipping carrier already exists')
    }

    return this.shippingCarrierRepository.save(createShippingCarrierDto)
  }

  findAll() {
    return this.shippingCarrierRepository.find()
  }

  async findOne(id: number) {
    const shippingCarrier = await this.shippingCarrierRepository.findOne({
      where: {
        id
      }
    })
    if (!shippingCarrier) {
      throw new NotFoundException('Shipping carrier not found')
    }

    return shippingCarrier
  }

  async update(id: number, updateShippingCarrierDto: UpdateShippingCarrierDto) {
    const shippingCarrier = await this.findOne(id)
    return this.shippingCarrierRepository.update(
      shippingCarrier.id,
      updateShippingCarrierDto
    )
  }

  async remove(id: number) {
    const shippingCarrier = await this.findOne(id)
    return this.shippingCarrierRepository.remove(shippingCarrier)
  }
}
