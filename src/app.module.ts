import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { Product } from './products/models/products.model';
import { CategoriesModule } from './categories/categories.module';
import { AromasModule } from './aromas/aromas.module';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/models/orders.model';
import { Category } from './categories/categories.model';
import { Aroma } from './aromas/aromas_models/aromas.model';
import { OrderProduct } from './orders/models/order_products.model';
import { OrderAddress } from './orders/models/order_addresses.model';
import { AromaCategory } from './aromas/aromas_models/aroma_categories.model';
import { AromaDescription } from './aromas/aromas_models/aroma_descriptions.model';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail_service/mail_service.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CdekModule } from './cdek/cdek.module';
import { PaymentModule } from './payment/payment.module';
import { Package } from './products/models/package.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [
        Product,
        Category,
        Aroma,
        AromaCategory,
        AromaDescription,
        Order,
        OrderProduct,
        OrderAddress,
        Package
      ],
      autoLoadModels: true,
      timezone: '+03:00',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
    }),
    ProductsModule,
    CategoriesModule,
    AromasModule,
    OrdersModule,
    MailModule,
    CdekModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
