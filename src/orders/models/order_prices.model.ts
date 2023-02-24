import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Order } from './orders.model';

interface OrderPriceCreationAttrs {
	price: number
	shipping_price: number
	order_id: number
}

@Table({ tableName: 'order_price', underscored: true })
export class OrderPrice extends Model<OrderPrice, OrderPriceCreationAttrs> {
	@ApiProperty({ example: '1', description: 'unique identifier' })
	@Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
	id: number

	@ApiProperty({ example: '300', description: 'order products total price' })
	@Column({ type: DataType.INTEGER, allowNull: false })
	price: number

	@ApiProperty({ example: '200', description: 'shipping price' })
	@Column({ type: DataType.INTEGER, allowNull: false })
	shipping_price: number

	@ApiProperty({ example: '4', description: 'order id' })
	@ForeignKey(() => Order)
	@Column({ type: DataType.INTEGER })
	order_id: Order

	@BelongsTo(() => Order)
	order: Order;
}