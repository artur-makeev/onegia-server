import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class UpdateOrderStatusDto {
	@ApiProperty({ example: '3', description: 'order id' })
	readonly id: number;

	@ApiProperty({ example: 'complete', description: 'order status' })
	readonly status: string;
}

export class GetOrdersDto {
	@ApiProperty({ example: 'active', description: 'filter orders' })
	readonly filter?: string;
}
