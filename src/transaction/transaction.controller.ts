import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query,
  Patch,
  Delete
} from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { Roles } from '@/role/roles.decorator'
import { Role } from '@/role/role.enum'
import { RolesGuard } from '@/role/roles.guard'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { UpdateTransactionDto } from '@/transaction/dto/update-transactions.dto'

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto)
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.transactionService.findAll(paginationQueryDto)
  }

  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: number) {
    return this.transactionService.findOne(+id)
  }

  @Get('user/:userId')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findByUser(
    @Param('userId') userId: number,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    return this.transactionService.findUserTransactions(
      +userId,
      paginationQueryDto
    )
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id') id: number,
    @Body() updateTransactionDto: UpdateTransactionDto
  ) {
    await this.transactionService.update(+id, updateTransactionDto)
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: number) {
    await this.transactionService.delete(+id)
  }
}
