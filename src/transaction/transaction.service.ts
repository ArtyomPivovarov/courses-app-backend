import { Injectable } from '@nestjs/common'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { Transaction } from './entities/transaction.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>
  ) {}

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find()
  }

  async findOne(id: number): Promise<Transaction> {
    return this.transactionRepository.findOne({ where: { id } })
  }

  async create(
    createTransactionDto: CreateTransactionDto
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create(createTransactionDto)
    return this.transactionRepository.save(transaction)
  }
}
