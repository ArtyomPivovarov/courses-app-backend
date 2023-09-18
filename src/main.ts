import 'reflect-metadata'
import 'module-alias/register'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { version } from 'package.json'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ ignoreTrailingSlash: true }),
    {
      snapshot: true,
      abortOnError: false
    }
  )

  app.setGlobalPrefix('api')
  app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Courses app')
    .setVersion(version)
    .build()
  const document = SwaggerModule.createDocument(app, config)
  for (const path in document.paths) {
    for (const method in document.paths[path]) {
      const operation = document.paths[path][method]
      operation.security = operation.security || [{ bearer: [] }]
    }
  }
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)
}
bootstrap()
