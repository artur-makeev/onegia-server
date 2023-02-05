import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MailService } from 'src/mail_service/mail.service';
import { Product } from 'src/products/products.model';
import { CreateOrderDto } from './dto/order.dto';
import { Order } from './orders_models/orders.model';
import { OrderAddress } from './orders_models/order_addresses.model';
import { OrderProduct } from './orders_models/order_products.model';


@Injectable()
export class OrdersService {
	constructor(
		@InjectModel(Order) private orderRepository: typeof Order,
		@InjectModel(OrderAddress) private orderAddressRepository: typeof OrderAddress,
		@InjectModel(OrderProduct) private orderProductRepository: typeof OrderProduct,
		@InjectModel(Product) private productRepository: typeof Product,
		@Inject(MailService) private mailService: MailService,
	) {}

	async createOrder(props: CreateOrderDto) {
		const { lastName, firstName, fatherName, email, phone, address, contact, basketProducts, shippingPrice, productsPrice } = props;
		const order = await this.orderRepository.create({
			status: 'Оформлен',
			price: productsPrice
		});
		const basketProductsJS = JSON.parse(basketProducts);

		for (const item of basketProductsJS) {
			for (let i = 0; i < item.count; i++) {
				await this.orderProductRepository.create({ orderId: order.id, productId: item.productId, aromaId: item.aromaId });
			}
		}

		await this.orderAddressRepository.create({
			lastName, firstName, fatherName, email, phone, address, contact, orderId: order.id, shippingPrice
		})

		const orderWithProducts = await this.orderProductRepository.findAll({
			include: {
				model: Product
			}, where: { orderId: order.id },
			raw: true,
		})

		this.mailService.sendOrderNotificationToAdmin(order.id, lastName, firstName, fatherName, email, phone, address, contact, orderWithProducts);
		this.mailService.sendOrderNotificationToClient(order.id, lastName, firstName, fatherName, email, phone, address, orderWithProducts);

		return order.id;
	} catch(e) {
		console.log(e.message);
	}

}

