import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators';

export class GetProductsDto {
	@ApiPropertyOptional({ example: '1', description: 'id of the category' })
	readonly categoryId?: string;

	@ApiPropertyOptional({
		example: '4',
		description: 'number of products per page',
	})
	readonly limit?: string;

	@ApiPropertyOptional({ example: '2', description: 'page number' })
	readonly page?: string;
}
