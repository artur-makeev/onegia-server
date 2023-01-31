import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './categories.model';

@Injectable()
export class CategoriesService {

	constructor(@InjectModel(Category) private categoryRepository: typeof Category) { }

	async getAllCategories() {
		try {
			const category = await this.categoryRepository.findAll();
			return category;
		} catch (e) {
			console.log(e.message);
		}
	}
}
