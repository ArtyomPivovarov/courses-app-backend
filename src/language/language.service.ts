import { BadRequestException, Injectable } from '@nestjs/common'
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
    const language = await this.languageRepository.findOne({
      where: { code: createLanguageDto.code }
    })
    if (language) {
      throw new BadRequestException('Language already exists')
    }

    return await this.languageRepository.save(createLanguageDto)
  }

  async findAll(): Promise<Language[]> {
    return await this.languageRepository.find()
  }

  async findOne(code: string): Promise<Language> {
    const language = await this.languageRepository.findOne({
      where: { code }
    })
    if (!language) {
      throw new BadRequestException('Language does not exist')
    }

    return language
  }

  async update(code: string, updateLanguageDto: UpdateLanguageDto) {
    return await this.languageRepository.update(code, updateLanguageDto)
  }

  async delete(code: string): Promise<void> {
    const language = await this.languageRepository.findOne({
      where: { code }
    })
    if (!language) {
      throw new BadRequestException('Language does not exist')
    }

    await this.languageRepository.delete(code)
  }
}
