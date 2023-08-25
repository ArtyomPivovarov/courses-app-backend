import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'
import { kebabCaseRegex } from '@/regex/cases.regex'

export class CreateProductCategoryDto {
  @IsNotEmpty()
  @Matches(kebabCaseRegex, {
    message: 'Slug must be in kebab-case'
  })
  slug: string

  @IsBoolean()
  isActive: boolean

  @MinLength(3, { message: 'Minimum name en length is 3 characters' })
  @MaxLength(30, { message: 'Maximum name en length is 30 characters' })
  nameEn: string

  @MinLength(3, { message: 'Minimum name ru length is 3 characters' })
  @MaxLength(30, { message: 'Maximum name ru length is 30 characters' })
  nameRu: string

  @IsOptional()
  @MaxLength(200, {
    message: 'Maximum description en length is 200 characters'
  })
  descriptionEn?: string

  @IsOptional()
  @MaxLength(200, {
    message: 'Maximum description ru length is 200 characters'
  })
  descriptionRu?: string
}
