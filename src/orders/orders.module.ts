import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './orders_models/orders.model';
import { OrderAddress } from './orders_models/order_addresses.model';
import { OrderProduct } from './orders_models/order_products.model';
import { Product } from 'src/products/products.model';
import { MailModule } from 'src/mail_service/mail_service.module';

@Module({
  providers: [OrdersService],
  controllers: [OrdersController],
  imports: [
    MailModule,
    SequelizeModule.forFeature([Order, OrderAddress, OrderProduct, Product])
  ]
})
export class OrdersModule { }
