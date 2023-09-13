import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto'
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto'
import { PaymentMethod } from '@/payment-method/entities/payment-method.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>
  ) {}

  async create(createPaymentMethodDto: CreatePaymentMethodDto) {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { name: createPaymentMethodDto.name }
    })
    if (paymentMethod) {
      throw new BadRequestException(
        'Payment method with this name already exists'
      )
    }

    return this.paymentMethodRepository.save(createPaymentMethodDto)
  }

  findAll() {
    return this.paymentMethodRepository.find({
      order: {
        rating: {
          direction: 'DESC',
          nulls: 'LAST'
        },
        createdAt: 'DESC'
      }
    })
  }

  async findOne(id: number) {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id }
    })
    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found')
    }

    return paymentMethod
  }

  async update(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    const paymentMethod = await this.findOne(id)
    return this.paymentMethodRepository.update(
      paymentMethod.id,
      updatePaymentMethodDto
    )
  }

  async remove(id: number) {
    const paymentMethod = await this.findOne(id)
    return this.paymentMethodRepository.remove(paymentMethod)
  }
}
