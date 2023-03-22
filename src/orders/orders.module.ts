import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './models/orders.model';
import { OrderAddress } from './models/order_addresses.model';
import { OrderProduct } from './models/order_products.model';
import { Product } from 'src/products/models/products.model';
import { MailModule } from 'src/mail_service/mail_service.module';
import { OrderPrice } from './models/order_prices.model';

@Module({
	providers: [OrdersService],
	controllers: [OrdersController],
	imports: [
		MailModule,
		SequelizeModule.forFeature([
			Order,
			OrderPrice,
			OrderAddress,
			OrderProduct,
			Product,
		]),
	],
})
export class OrdersModule {}
