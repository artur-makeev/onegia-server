import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNumberString, IsString } from 'class-validator';

export class CreateOrderDto {
	@ApiProperty({ example: 'Brown', description: 'lastname' })
	@IsString()
	readonly lastName: string;

	@ApiProperty({ example: 'John', description: 'firstname' })
	@IsString()
	readonly firstName: string;

	@ApiProperty({ example: 'Brown', description: 'lastname' })
	@IsString()
	readonly fatherName: string;

	@ApiProperty({ example: 'name@gmail.com', description: 'email' })
	@IsString()
	readonly email: string;

	@ApiProperty({ example: '+44 7700 900504' })
	@IsString()
	readonly phone: string;

	@ApiProperty({ example: '309 Regent St., London W1B 2HW', description: 'address' })
	@IsString()
	readonly address: string;

	@ApiProperty({ example: 'telegram', description: 'clients communication preference' })
	@IsString()
	readonly contact: 'позвонить' | 'whatsup' | 'telegram' | 'email';

	@ApiProperty({ example: 'cdek', description: 'type of chosen delivery' })
	@IsString()
	readonly shippingType: string;

	@ApiProperty({ example: '4', description: 'number of delivery days' })
	@IsNumberString()
	readonly shippingTime: number;

	@ApiProperty({ example: '200', description: 'delivery price' })
	@IsNumberString()
	readonly shippingPrice: number;

	@ApiProperty({ example: '200', description: 'products price' })
	@IsNumberString()
	readonly productsPrice: number;

	@ApiProperty({ example: '{some fields}', description: 'products in the basket' })
	@IsString()
	readonly basketProducts: string;

}
