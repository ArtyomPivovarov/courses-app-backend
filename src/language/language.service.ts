// language.service.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Language } from '@/language/entities/language.entity'
import { CreateLanguageDto } from '@/language/dto/create-language.dto'
import { UpdateLanguageDto } from '@/language/dto/update-language.dto'

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>
  ) {}

  async create(createLanguageDto: CreateLanguageDto): Promise<Language> {
    return await this.languageRepository.save(createLanguageDto)
  }

  async findAll(): Promise<Language[]> {
    return await this.languageRepository.find()
  }

  async findOne(code: string): Promise<Language> {
    return await this.languageRepository.findOne({ where: { code } })
  }

  async update(
    code: string,
    updateLanguageDto: UpdateLanguageDto
  ): Promise<Language> {
    await this.languageRepository.update(code, updateLanguageDto)
    return this.findOne(code)
  }

  async delete(code: string): Promise<void> {
    await this.languageRepository.delete(code)
  }
}
