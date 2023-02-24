import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Package } from './models/package.model';
import { ProductsWithIds } from './types/types';

@Injectable()
export class PackageService {

	constructor(
		@InjectModel(Package) private packageRepository: typeof Package
	) {}

	async getPackageParameters(products: ProductsWithIds) {
		try {
			let totalWeight = 0;
			let totalVolume = 0;
			const productsArr = [];

			for (const [key, value] of Object.entries(products)) {
				productsArr.push([key, value])
			}

			for (const product of productsArr) {
				const productRecord = await this.packageRepository.findOne({
					where: { product_id: product[0] }
				});
				totalWeight += (productRecord.weight * product[1]);
				totalVolume += (productRecord.volume * product[1]);
			}

			totalVolume = totalVolume * 4;
			const sideLength = Math.round(Math.cbrt(totalVolume));

			return {
				packageWeight: totalWeight,
				packageSideLength: sideLength
			};
		} catch (e) {
			console.log(e.message);

		};
	}
}
