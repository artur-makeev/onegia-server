import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators';

export class GeneratePaymentUrlDto {
	@ApiPropertyOptional({ example: '155.45', description: 'total price' })
	readonly outSum: string;

	@ApiPropertyOptional({
		example: '44',
		description: 'invoice number (order number)',
	})
	readonly invId: string;

	@ApiPropertyOptional({
		example: '{"something": "123"}',
		description: 'receipt information',
	})
	readonly items: JSON;
}

export class PaymentConfirmationDto {
	@ApiPropertyOptional({ example: '155.45', description: 'total price' })
	readonly OutSum: string;

	@ApiPropertyOptional({
		example: '44',
		description: 'invoice number (order number)',
	})
	readonly InvId: string;

	@ApiPropertyOptional({ example: 'JHIHUH', description: 'signature' })
	readonly SignatureValue: string;
}
