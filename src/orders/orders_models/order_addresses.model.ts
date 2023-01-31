import { Column, DataType, Model, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Order } from './orders.model';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

interface OrderAddressCreationAttrs {
	lastName: string
	firstName: string
	fatherName: string
	email: string
	phone: string
	address: string
	contact: string
	orderId: number,
	shippingPrice: number
}

@Table({ tableName: 'order_addresses' })
export class OrderAddress extends Model<OrderAddress, OrderAddressCreationAttrs> {
	@ApiProperty({ example: '1', description: 'unique identifier' })
	@Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
	id: number

	@ApiProperty({ example: 'Brown', description: 'lastname' })
	@Column({ type: DataType.STRING })
	lastName: string

	@ApiProperty({ example: 'John', description: 'firstname' })
	@Column({ type: DataType.STRING })
	firstName: string

	@ApiProperty({ example: 'Christopher', description: 'father name' })
	@Column({ type: DataType.STRING })
	fatherName: string

	@ApiProperty({ example: 'name@gmail.com', description: 'email' })
	@Column({ type: DataType.STRING })
	email: string

	@ApiProperty({ example: '+44 7700 900504' })
	@Column({ type: DataType.STRING })
	phone: string

	@ApiProperty({ example: '309 Regent St., London W1B 2HW', description: 'address' })
	@Column({ type: DataType.STRING })
	address: string

	@ApiProperty({ example: '200', description: 'shipping price' })
	@Column({ type: DataType.INTEGER, allowNull: false })
	shippingPrice: number

	@ApiProperty({ example: 'telegram', description: 'clients contact preference' })
	@Column({ type: DataType.STRING })
	contact: string

	@BelongsTo(() => Order)
	order: Order;

	@ApiProperty({ example: '23', description: 'order`s id' })
	@ForeignKey(() => Order)
	@Column
	orderId: number;

}