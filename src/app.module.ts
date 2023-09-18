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
import { PaymentMethodModule } from './payment-method/payment-method.module'
import { DevtoolsModule } from '@nestjs/devtools-integration'
import { ShippingModule } from './shipping/shipping.module'
import { ShippingCarrierModule } from './shipping-carrier/shipping-carrier.module'
import { ShippingMethodModule } from './shipping-method/shipping-method.module'
import { DiscountModule } from './discount/discount.module'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from '@/role/roles.guard'

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
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production'
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
    PaymentMethodModule,
    ShippingModule,
    ShippingCarrierModule,
    ShippingMethodModule,
    DiscountModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useExisting: JwtAuthGuard
    },
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useExisting: RolesGuard
    },
    RolesGuard
  ]
})
export class AppModule {}
