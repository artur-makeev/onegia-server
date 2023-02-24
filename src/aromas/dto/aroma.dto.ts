import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class GetAromasByProductDto {
	@ApiProperty({ example: '2', description: 'id of product' })
	readonly product_id: number;
}

export class GetAromasByCategoryDto {
	@ApiProperty({ example: '1', description: 'id of the aroma category' })
	readonly aromaCategoryId: number;
}

export class GetAromaDescriptionDto {
	@ApiProperty({ example: '1', description: 'id of the aroma' })
	readonly aromaId: number;
}