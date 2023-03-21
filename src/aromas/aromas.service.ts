import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { Aroma } from './aromas_models/aromas.model';
import { AromaCategory } from './aromas_models/aroma_categories.model';
import { AromaDescription } from './aromas_models/aroma_descriptions.model';

interface AromaQuery {
	id: number,
	name: string,
	aroma_category_id: number,
	aroma_category_name: string
}

export class AromasService {

	constructor(
		@InjectModel(AromaCategory) private aromaCategoriesRepository: typeof AromaCategory,
		@InjectModel(Aroma) private aromasRepository: typeof Aroma,
		@InjectModel(AromaDescription) private aromasDescriptionRepository: typeof AromaDescription

	) {}

	async getAromasByProduct(product_id: number) {
		try {
			const data: AromaQuery[] = await this.aromasRepository.sequelize.query(
				`
				SELECT aromas.id, aromas.name, aroma_category_id, aroma_categories.name as aroma_category_name
				FROM aromas
				INNER JOIN products_aromas
				ON aromas.id = products_aromas.aroma_id
				INNER JOIN aroma_categories
				ON aroma_category_id = aroma_categories.id
				WHERE products_aromas.product_id = ${product_id};
				` , { type: QueryTypes.SELECT }
			);
			const aromaCategories = data.map(item => {
				return { id: item.aroma_category_id, name: item.aroma_category_name };
			});

			const filteredAromaCategories = aromaCategories.reduce((acc, current) => {
				const x = acc.find(item => item.id === current.id);
				if (!x) {
					return acc.concat([current]);
				} else {
					return acc;
				}
			}, []);


			const aromas = data.map(item => {
				return { id: item.id, name: item.name, aromaCategory: item.aroma_category_id };
			});

			return { aromas: aromas, aromaCategories: filteredAromaCategories };
		} catch (e) {
			console.log(e.message);
		}
	}

	async getAromas(aromaCategoryId: number) {
		try {
			const aromasRaw = await this.aromasRepository.findAll({
				where: { aroma_category_id: aromaCategoryId },
				raw: true,
			});
			const aromas = aromasRaw.map(item => {
				return { id: item.id, name: item.name };
			});
			return aromas;
		} catch (e) {
			console.log(e.message);
		}
	}

	async getAromaInfo(aromaId: number) {
		try {
			const aromaRaw = await this.aromasDescriptionRepository.findOne({
				where: { aroma_id: aromaId },
				raw: true,
			});
			const aroma = { top: aromaRaw.top, heart: aromaRaw.heart, base: aromaRaw.base };
			return aroma;
		} catch (e) {
			console.log(e.message);
		}
	}
}
