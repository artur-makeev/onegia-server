import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators';

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
