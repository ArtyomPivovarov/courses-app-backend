import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { CurrencyService } from './currency.service'
import { CreateCurrencyDto } from './dto/create-currency.dto'
import { UpdateCurrencyDto } from './dto/update-currency.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Currency } from '@/currency/entities/currency.entity'

@ApiTags('currencies')
@ApiBearerAuth()
@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @ApiOperation({ summary: 'Create currency' })
  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    return this.currencyService.create(createCurrencyDto)
  }

  @ApiOperation({ summary: 'Retrieve all currencies' })
  @Get()
  findAll(): Promise<Currency[]> {
    return this.currencyService.findAll()
  }

  @ApiOperation({ summary: 'Retrieve a currency by code' })
  @Get(':code')
  findOne(@Param('code') code: string): Promise<Currency> {
    return this.currencyService.findOne(code)
  }

  @ApiOperation({ summary: 'Update currency by code' })
  @Patch(':code')
  async update(
    @Param('code') code: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto
  ): Promise<void> {
    await this.currencyService.update(code, updateCurrencyDto)
  }

  @ApiOperation({ summary: 'Delete currency by code' })
  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.currencyService.remove(code)
  }
}
