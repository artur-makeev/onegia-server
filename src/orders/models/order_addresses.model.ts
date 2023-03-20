import { Column, DataType, Model, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Order } from './orders.model';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

interface OrderAddressCreationAttrs {
	last_name: string
	first_name: string
	father_name: string
	email: string
	phone: string
	address: string
	shipping_type: string
	contact: string
	order_id: number
}

@Table({ tableName: 'order_addresses', underscored: true })
export class OrderAddress extends Model<OrderAddress, OrderAddressCreationAttrs> {
	@ApiProperty({ example: '1', description: 'unique identifier' })
	@Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
	id: number;

	@ApiProperty({ example: 'Brown', description: 'lastname' })
	@Column({ type: DataType.STRING })
	last_name: string;

	@ApiProperty({ example: 'John', description: 'firstname' })
	@Column({ type: DataType.STRING })
	first_name: string;

	@ApiProperty({ example: 'Christopher', description: 'father name' })
	@Column({ type: DataType.STRING })
	father_name: string;

	@ApiProperty({ example: 'name@gmail.com', description: 'email' })
	@Column({ type: DataType.STRING })
	email: string;

	@ApiProperty({ example: '+44 7700 900504' })
	@Column({ type: DataType.STRING })
	phone: string;

	@ApiProperty({ example: '309 Regent St., London W1B 2HW', description: 'address' })
	@Column({ type: DataType.STRING })
	address: string;

	@ApiProperty({ example: 'cdek', description: 'shipping type' })
	@Column({ type: DataType.STRING })
	shipping_type: string;

	@ApiProperty({ example: 'telegram', description: 'clients contact preference' })
	@Column({ type: DataType.STRING })
	contact: string;

	@ApiProperty({ example: '23', description: 'order`s id' })
	@ForeignKey(() => Order)
	@Column
	order_id: number;

	@BelongsTo(() => Order)
	order: Order;

}