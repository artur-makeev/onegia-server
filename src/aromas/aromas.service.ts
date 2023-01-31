import { InjectModel } from '@nestjs/sequelize';
import { Aroma } from './aromas_models/aromas.model';
import { AromaCategory } from './aromas_models/aroma_categories.model';
import { AromaDescription } from './aromas_models/aroma_descriptions.model';

export class AromasService {

	constructor(
		@InjectModel(AromaCategory) private aromaCategoriesRepository: typeof AromaCategory,
		@InjectModel(Aroma) private aromasRepository: typeof Aroma,
		@InjectModel(AromaDescription) private aromasDescriptionRepository: typeof AromaDescription

	) { }

	async getAromaCategories(categoryId: string) {
		try {
			const aromaCategoriesRaw = await this.aromaCategoriesRepository.findAll({
				where: { categoryId: categoryId },
				raw: true,
			})

			const aromaCategories = aromaCategoriesRaw.map((item) => {
				return { id: item.id, name: item.name }
			})

			return aromaCategories;
		} catch (e) {
			console.log(e.message);
		}
	}

	async getAromas(aromaCategoryId: string) {
		try {
			const aromasRaw = await Aroma.findAll({
				where: { aromaCategoryId: aromaCategoryId },
				raw: true,
			})
			const aromas = aromasRaw.map(item => {
				return { id: item.id, name: item.name };
			})
			return aromas;
		} catch (e) {
			console.log(e.message);
		}
	}

	async getAromaInfo(aromaId: string) {
		try {
			const aromaRaw = await AromaDescription.findOne({
				where: { aromaId: aromaId },
				raw: true,
			})
			const aroma = { top: aromaRaw.top, heart: aromaRaw.heart, base: aromaRaw.base };
			return aroma;
		} catch (e) {
			console.log(e.message);
		}
	}
}
