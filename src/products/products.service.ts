import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GetProductsDto } from './dto/products.dto';
import { Product } from './products.model';

@Injectable()
export class ProductsService {

	constructor(@InjectModel(Product) private productRepository: typeof Product) {}

	async getAllProducts(query: GetProductsDto) {
		try {
			const categoryId: number = parseInt(query.categoryId);
			let limit: number = parseInt(query.limit);
			let page: number = parseInt(query.page)
			page = page || 1;
			limit = +limit || 9;
			const offset = page * limit - limit;
			let products;

			if (categoryId) {
				products = await this.productRepository.findAndCountAll({ where: { categoryId }, limit, offset });
			}

			if (!categoryId) {
				products = await this.productRepository.findAndCountAll({ limit, offset });
			}

			return products;
		} catch (e) {
			console.log(e.message);

		};
	}
}
