import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Column, DataType, HasMany, Model, Table, HasOne } from 'sequelize-typescript';
import { OrderAddress } from './order_addresses.model';
import { OrderPrice } from './order_prices.model';
import { OrderProduct } from './order_products.model';

interface OrderCreationAttrs {
	status: string
}

@Table({ tableName: 'orders', underscored: true })
export class Order extends Model<Order, OrderCreationAttrs> {
	@ApiProperty({ example: '1', description: 'unique identifier' })
	@Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
	id: number;

	@ApiProperty({ example: 'Complete', description: 'order status' })
	@Column({ type: DataType.STRING, allowNull: false })
	status: string;

	@HasMany(() => OrderProduct)
	order_products: OrderProduct[];

	@HasOne(() => OrderAddress)
	order_addreess: OrderAddress;

	@HasOne(() => OrderPrice)
	order_price: OrderPrice;
}