import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Column, DataType, HasMany, Model, Table, HasOne } from 'sequelize-typescript';
import { OrderAddress } from './order_addresses.model';
import { OrderProduct } from './order_products.model';

interface OrderCreationAttrs {
	status: string
	shippingType: string
	shippingPrice: string
}

@Table({ tableName: 'orders' })
export class Order extends Model<Order, OrderCreationAttrs> {
	@ApiProperty({ example: '1', description: 'unique identifier' })
	@Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
	id: number

	@ApiProperty({ example: 'Complete', description: 'order status' })
	@Column({ type: DataType.STRING, allowNull: false })
	status: string

	@HasMany(() => OrderProduct)
	orderProducts: OrderProduct[];

	@HasOne(() => OrderAddress)
	orderAddreess: OrderAddress;
}