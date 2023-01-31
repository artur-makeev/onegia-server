import { ApiProperty } from '@nestjs/swagger/dist/decorators';

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

	@ApiProperty({ example: '500', description: 'weight (grams)' })
	readonly weight: string
}