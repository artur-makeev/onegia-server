import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GetProductsDto } from './dto/products.dto';
import { Product } from './models/products.model';

@Injectable()
export class ProductsService {

	constructor(
		@InjectModel(Product) private productRepository: typeof Product
	) {}

	async getAllProducts(query: GetProductsDto) {
		try {
			const category_id: number = parseInt(query.categoryId);
			let limit: number = parseInt(query.limit);
			let page: number = parseInt(query.page)
			page = page || 1;
			limit = +limit || 9;
			const offset = page * limit - limit;
			let products;

			if (category_id) {
				products = await this.productRepository.findAndCountAll({
					where: { category_id },
					attributes: { exclude: ['createdAt', 'updatedAt'] },
					order: [
						['id', 'ASC']
					],
					limit,
					offset
				});
			}

			if (!category_id) {
				products = await this.productRepository.findAndCountAll({
					attributes: { exclude: ['createdAt', 'updatedAt'] },
					order: [
						['id', 'ASC']
					],
					limit,
					offset
				});
			}

			return products;
		} catch (e) {
			console.log(e.message);

		};
	}
}
