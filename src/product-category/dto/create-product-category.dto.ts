import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'
import { kebabCaseRegex } from '@/common/regex/cases.regex'

export class CreateProductCategoryDto {
  @IsNotEmpty()
  @Matches(kebabCaseRegex, {
    message: 'Slug must be in kebab-case'
  })
  slug: string

  @IsBoolean()
  isActive: boolean

  @MinLength(3, { message: 'Minimum name length is 3 characters' })
  @MaxLength(30, { message: 'Maximum name length is 30 characters' })
  name: string

  @IsOptional()
  @MaxLength(200, {
    message: 'Maximum description length is 200 characters'
  })
  description?: string

  @IsOptional()
  @IsObject({ message: 'Translations must be an object', each: true })
  translations?: {
    [langCode: string]: {
      name?: string
      description?: string
    }
  }
}
