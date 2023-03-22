import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MailService } from 'src/mail_service/mail.service';
import { Product } from 'src/products/models/products.model';
import { CreateOrderDto } from './dto/order.dto';
import { Order } from './models/orders.model';
import { OrderAddress } from './models/order_addresses.model';
import { OrderPrice } from './models/order_prices.model';
import { OrderProduct } from './models/order_products.model';

@Injectable()
export class OrdersService {
	constructor(
		@InjectModel(Order) private orderRepository: typeof Order,
		@InjectModel(OrderAddress)
		private orderAddressRepository: typeof OrderAddress,
		@InjectModel(OrderProduct)
		private orderProductRepository: typeof OrderProduct,
		@InjectModel(OrderPrice) private orderPriceRepository: typeof OrderPrice,
		@Inject(MailService) private mailService: MailService,
	) {}

	async createOrder(props: CreateOrderDto) {
		const {
			lastName,
			firstName,
			fatherName,
			email,
			phone,
			address,
			shippingType,
			shippingTime,
			contact,
			basketProducts,
			shippingPrice,
			productsPrice,
		} = props;

		const order = await this.orderRepository.create({
			status: 'created',
		});
		const basketProductsJS = JSON.parse(basketProducts);

		await this.orderPriceRepository.create({
			price: productsPrice,
			shipping_price: shippingPrice,
			client_paid: 0,
			order_id: order.id,
		});

		for (const item of basketProductsJS) {
			for (let i = 0; i < item.count; i++) {
				await this.orderProductRepository.create({
					order_id: order.id,
					product_id: item.productId,
					aroma_id: item.aromaId,
				});
			}
		}

		await this.orderAddressRepository.create({
			last_name: lastName,
			first_name: firstName,
			father_name: fatherName,
			email,
			phone,
			address,
			shipping_type: shippingType,
			contact,
			order_id: order.id,
		});

		const orderWithProducts = await this.orderProductRepository.findAll({
			include: {
				model: Product,
			},
			where: { order_id: order.id },
			raw: true,
		});

		this.mailService.sendOrderNotificationToAdmin(
			order.id,
			lastName,
			firstName,
			fatherName,
			email,
			phone,
			address,
			shippingType,
			shippingTime,
			shippingPrice,
			contact,
			orderWithProducts,
		);

		this.mailService.sendOrderNotificationToClient(
			order.id,
			lastName,
			firstName,
			fatherName,
			email,
			phone,
			address,
			shippingType,
			shippingTime,
			shippingPrice,
			orderWithProducts,
		);

		return order.id;
	}
	catch(e) {
		console.log(e.message);
	}
}
