import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateCurrencyDto } from './dto/create-currency.dto'
import { UpdateCurrencyDto } from './dto/update-currency.dto'
import { Currency } from '@/currency/entities/currency.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto) {
    const currency = await this.currencyRepository.findOne({
      where: { code: createCurrencyDto.code }
    })
    if (currency) {
      throw new BadRequestException('Currency already exists')
    }

    return this.currencyRepository.save(createCurrencyDto)
  }

  findAll() {
    return this.currencyRepository.find()
  }

  async findOne(code: string) {
    const currency = await this.currencyRepository.findOne({
      where: { code }
    })
    if (!currency) {
      throw new NotFoundException('Currency not found')
    }

    return currency
  }

  async update(code: string, updateCurrencyDto: UpdateCurrencyDto) {
    const currency = await this.currencyRepository.findOne({
      where: { code }
    })
    if (!currency) {
      throw new NotFoundException('Currency not found')
    }

    return this.currencyRepository.update(code, updateCurrencyDto)
  }

  async remove(code: string) {
    const currency = await this.currencyRepository.findOne({
      where: { code }
    })
    if (!currency) {
      throw new NotFoundException('Currency not found')
    }

    return this.currencyRepository.delete(code)
  }
}
