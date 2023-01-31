import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class GetAromaCategoriesDto {
	@ApiProperty({ example: '1', description: 'id of the product`s category' })
	readonly categoryId: string;
}

export class GetAromasDto {
	@ApiProperty({ example: '1', description: 'id of the aroma category' })
	readonly aromaCategoryId: string;
}

export class GetAromaDescriptionDto {
	@ApiProperty({ example: '1', description: 'id of the aroma' })
	readonly aromaId: string;
}