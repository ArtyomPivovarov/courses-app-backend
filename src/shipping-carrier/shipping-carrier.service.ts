import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateShippingCarrierDto } from './dto/create-shipping-carrier.dto'
import { UpdateShippingCarrierDto } from './dto/update-shipping-carrier.dto'
import { ShippingCarrier } from '@/shipping-carrier/entities/shipping-carrier.entity'
import { In, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ShippingMethod } from '@/shipping-method/entities/shipping-method.entity'

@Injectable()
export class ShippingCarrierService {
  constructor(
    @InjectRepository(ShippingCarrier)
    private readonly shippingCarrierRepository: Repository<ShippingCarrier>,
    @InjectRepository(ShippingMethod)
    private readonly shippingMethodRepository: Repository<ShippingMethod>
  ) {}
  async create(createShippingCarrierDto: CreateShippingCarrierDto) {
    const { shippingMethodIds, ...rest } = createShippingCarrierDto
    const shippingCarrier = await this.shippingCarrierRepository.findOne({
      where: {
        name: createShippingCarrierDto.name
      }
    })
    if (shippingCarrier) {
      throw new BadRequestException('Shipping carrier already exists')
    }
    const shippingMethods = await this.shippingMethodRepository.find({
      where: {
        id: In(shippingMethodIds)
      }
    })
    if (shippingMethodIds.length !== shippingMethods.length) {
      throw new BadRequestException('Shipping method not found')
    }

    return this.shippingCarrierRepository.save({
      ...rest,
      shippingMethods
    })
  }

  findAll() {
    return this.shippingCarrierRepository.find({
      relations: {
        shippingMethods: true
      }
    })
  }

  async findOne(id: number) {
    const shippingCarrier = await this.shippingCarrierRepository.findOne({
      where: {
        id
      },
      relations: {
        shippingMethods: true
      }
    })
    if (!shippingCarrier) {
      throw new NotFoundException('Shipping carrier not found')
    }

    return shippingCarrier
  }

  async update(id: number, updateShippingCarrierDto: UpdateShippingCarrierDto) {
    const shippingCarrier = await this.findOne(id)
    const { shippingMethodIds, ...rest } = updateShippingCarrierDto
    if (shippingMethodIds) {
      const shippingMethods = await this.shippingMethodRepository.find({
        where: {
          id: In(shippingMethodIds)
        }
      })
      if (shippingMethodIds.length !== shippingMethods.length) {
        throw new BadRequestException('Shipping method not found')
      }

      shippingCarrier.shippingMethods = shippingMethods
    }

    Object.assign(shippingCarrier, rest)

    return this.shippingCarrierRepository.save(shippingCarrier)
  }

  async remove(id: number) {
    const shippingCarrier = await this.findOne(id)
    return this.shippingCarrierRepository.remove(shippingCarrier)
  }
}
