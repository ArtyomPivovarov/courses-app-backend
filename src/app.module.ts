import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { PaymentModule } from '@/payment/payment.module'
import { ProductModule } from './product/product.module'
import { ProductCategoryModule } from './product-category/product-category.module'
import { AuthModule } from './auth/auth.module'
import { OrderModule } from './order/order.module'
import { LanguageModule } from './language/language.module'
import { ProductPriceModule } from './product-price/product-price.module'
import { CurrencyModule } from '@/currency/currency.module'
import { CartModule } from './cart/cart.module'
import { CartItemModule } from './cart-item/cart-item.module'
import { OrderDetailModule } from './order-detail/order-detail.module'
import { PaymentMethodModule } from './payment-method/payment-method.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST'),
        port: parseInt(configService.get('PG_PORT')),
        username: configService.get('PG_USER'),
        password: configService.get('PG_PASSWORD'),
        database: configService.get('PG_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    UserModule,
    ProductCategoryModule,
    ProductModule,
    ProductPriceModule,
    CartModule,
    CartItemModule,
    OrderModule,
    OrderDetailModule,
    LanguageModule,
    PaymentModule,
    CurrencyModule,
    PaymentMethodModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
