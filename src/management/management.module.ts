import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Aroma } from 'src/aromas/aromas_models/aromas.model';
import { Order } from 'src/orders/models/orders.model';
import { OrderAddress } from 'src/orders/models/order_addresses.model';
import { OrderPrice } from 'src/orders/models/order_prices.model';
import { OrderProduct } from 'src/orders/models/order_products.model';
import { Product } from 'src/products/models/products.model';
import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';

@Module({
	controllers: [ManagementController],
	providers: [ManagementService],
	imports: [
		SequelizeModule.forFeature([
			Order,
			OrderPrice,
			OrderAddress,
			OrderProduct,
			Product,
			Aroma,
		]),
	],
})
export class ManagementModule {}
