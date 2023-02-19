import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { ProductsWithIds } from 'src/products/types/types';

export class GetCitiesDto {
	@ApiProperty({ example: '1', description: 'region id' })
	readonly region_code: string;
}

export class GetAddressesDto {
	@ApiProperty({ example: '1', description: 'city id' })
	readonly city_code: string;
}

export class GetDeliveryDetailsDto {
	@ApiProperty({ example: 'address', description: 'delivery address' })
	readonly to_address: string

	@ApiProperty({ example: '{1: 3, 2: 5}', description: 'object with products ids and their count: {productId: count}' })
	readonly packageProducts: ProductsWithIds
}