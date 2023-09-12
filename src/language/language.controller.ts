import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth
} from '@nestjs/swagger'
import { LanguageService } from './language.service'
import { CreateLanguageDto } from '@/language/dto/create-language.dto'
import { Language } from './entities/language.entity'
import { UpdateLanguageDto } from '@/language/dto/update-language.dto'
import { RolesGuard } from '@/role/roles.guard'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { Roles } from '@/role/roles.decorator'
import { Role } from '@/role/role.enum'

@ApiTags('languages')
@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @ApiOperation({ summary: 'Create language' })
  @ApiResponse({
    status: 201,
    description: 'The language has been successfully created.'
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  create(@Body() createLanguageDto: CreateLanguageDto): Promise<Language> {
    return this.languageService.create(createLanguageDto)
  }

  @ApiOperation({ summary: 'Retrieve languages' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [Language]
  })
  @Get()
  findAll(): Promise<Language[]> {
    return this.languageService.findAll()
  }

  @ApiOperation({ summary: 'Retrieve a language by language code' })
  @ApiResponse({ status: 200, description: 'The found record', type: Language })
  @Get(':code')
  findOne(@Param('code') code: string): Promise<Language> {
    return this.languageService.findOne(code)
  }

  @ApiOperation({ summary: 'Update language' })
  @ApiResponse({
    status: 200,
    description: 'The language has been successfully updated.',
    type: Language
  })
  @ApiBearerAuth()
  @Patch(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async update(
    @Param('code') code: string,
    @Body() updateLanguageDto: UpdateLanguageDto
  ): Promise<void> {
    await this.languageService.update(code, updateLanguageDto)
  }

  @ApiOperation({ summary: 'Delete language' })
  @ApiResponse({ status: 200, description: 'The language has been deleted.' })
  @ApiBearerAuth()
  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remove(@Param('code') code: string): Promise<void> {
    return this.languageService.remove(code)
  }
}
