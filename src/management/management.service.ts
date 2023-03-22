import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Aroma } from 'src/aromas/aromas_models/aromas.model';
import { Order } from 'src/orders/models/orders.model';
import { OrderAddress } from 'src/orders/models/order_addresses.model';
import { OrderPrice } from 'src/orders/models/order_prices.model';
import { OrderProduct } from 'src/orders/models/order_products.model';
import { Product } from 'src/products/models/products.model';

@Injectable()
export class ManagementService {
	constructor(
		@InjectModel(Order) private orderRepository: typeof Order,
		@InjectModel(OrderAddress)
		private orderAddressRepository: typeof OrderAddress,
		@InjectModel(OrderProduct)
		private orderProductRepository: typeof OrderProduct,
		@InjectModel(OrderPrice) private orderPriceRepository: typeof OrderPrice,
		@InjectModel(Product) private productRepository: typeof Product,
		@InjectModel(Aroma) private aromaRepository: typeof Aroma,
	) {}

	private countProducts(orders) {
		for (const order of orders) {
			const countedProducts = [];

			for (const product of order.order_products) {
				const productPresent = countedProducts.findIndex(element => {
					return (
						element.product_name === product.product.name &&
						element.aroma_name === product.aroma.name
					);
				});

				if (productPresent > -1) {
					countedProducts[productPresent].count++;
				} else {
					countedProducts.push({
						product_name: product.product.name,
						aroma_name: product.aroma.name,
						count: 1,
					});
				}
			}

			order.order_products = countedProducts;
		}

		return orders;
	}

	async getOrders(query) {
		const { filter } = query;
		let orders;
		if (filter === 'active') {
			orders = await this.orderRepository.findAll({
				attributes: ['id', 'status', 'created_at'],
				where: {
					[Op.and]: [
						{
							status: {
								[Op.ne]: 'complete',
							},
						},
						{
							status: {
								[Op.ne]: 'cancelled',
							},
						},
					],
				},
				order: [['id', 'DESC']],
				include: [
					{
						model: this.orderAddressRepository,
						attributes: [
							'last_name',
							'first_name',
							'father_name',
							'email',
							'phone',
							'address',
							'shipping_type',
							'contact',
						],
					},
					{
						model: this.orderPriceRepository,
						attributes: ['price', 'shipping_price', 'client_paid'],
					},
					{
						model: this.orderProductRepository,
						attributes: ['product_id', 'aroma_id'],
						include: [
							{
								model: this.productRepository,
								attributes: ['name'],
							},
							{
								model: this.aromaRepository,
								attributes: ['name'],
							},
						],
					},
				],
			});
		} else {
			orders = await this.orderRepository.findAll({
				attributes: ['id', 'status', 'created_at'],
				order: [['id', 'DESC']],
				include: [
					{
						model: this.orderAddressRepository,
						attributes: [
							'last_name',
							'first_name',
							'father_name',
							'email',
							'phone',
							'address',
							'shipping_type',
							'contact',
						],
					},
					{
						model: this.orderPriceRepository,
						attributes: ['price', 'shipping_price', 'client_paid'],
					},
					{
						model: this.orderProductRepository,
						attributes: ['product_id', 'aroma_id'],
						include: [
							{
								model: this.productRepository,
								attributes: ['name'],
							},
							{
								model: this.aromaRepository,
								attributes: ['name'],
							},
						],
					},
				],
			});
		}

		orders = JSON.parse(JSON.stringify(orders));

		this.countProducts(orders);

		return orders;
	}

	async changeOrderStatus(body) {
		const { id, status } = body;
		const order = await this.orderRepository.findOne({ where: { id } });
		order.set({ status });
		await order.save();

		return status;
	}
}
