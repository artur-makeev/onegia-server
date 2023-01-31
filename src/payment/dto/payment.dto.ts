import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators';

export class GeneratePaymentUrlDto {
	@ApiPropertyOptional({ example: '155.45', description: 'total price' })
	readonly outSum: string;

	@ApiPropertyOptional({ example: 'Purchase in the store "Store Name"', description: 'operation description' })
	readonly description: string;

	@ApiPropertyOptional({ example: '44', description: 'invoice number (order number)' })
	readonly invId: string;
}

export class PaymentConfirmationDto {
	@ApiPropertyOptional({ example: '155.45', description: 'total price' })
	readonly OutSum: string;

	@ApiPropertyOptional({ example: '44', description: 'invoice number (order number)' })
	readonly InvId: string;

	@ApiPropertyOptional({ example: 'JHIHUH', description: 'signature' })
	readonly SignatureValue: string;
}
