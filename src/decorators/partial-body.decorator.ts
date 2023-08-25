import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext
} from '@nestjs/common'
import { METADATA__PARAM_TYPE } from './constants.decorators' // METADATA__PARAM_TYPE = 'partialBodyType'
import { paramTypeEnhancer } from './param-type.enhancer'
import { validate } from 'class-validator'
import { plainToClassFromExist } from 'class-transformer'

/**
 * Just like @Body() but allows partials. You must have
 * validateCustomDecorators=false in your global validation pipe.
 */
export const PartialBody = createParamDecorator(
  // Someone may want to explicitly choose the type to validate against, so if
  // they pass a parameter like @PartialBody(MyType), then data will be MyType
  // and we will use that for validation instead of the metadata type found.
  async (data: unknown, ctx: ExecutionContext): Promise<any> => {
    // Determine the type, either explicitly provided or from the metadata.
    const metatype =
      data !== undefined
        ? data
        : Reflect.getOwnMetadata(METADATA__PARAM_TYPE, ctx.getHandler())

    // Validate partially.
    const request = ctx.switchToHttp().getRequest()
    const transformedValue = plainToClassFromExist(metatype, request.body)
    const errors = await validate(transformedValue, {
      skipUndefinedProperties: true
    })
    console.log(errors, transformedValue)
    if (errors.length > 0) {
      throw new BadRequestException(errors)
    }
  },
  [paramTypeEnhancer]
)
