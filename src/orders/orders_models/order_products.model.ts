import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from 'src/products/products.model';
import { Order } from './orders.model';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

interface OrderProductCreationAttrs {
	orderId: number
	productId: string
	aromaId: string
}

@Table({ tableName: 'order_products' })
export class OrderProduct extends Model<OrderProduct, OrderProductCreationAttrs> {
	@ApiProperty({ example: '1', description: 'unique identifier' })
	@Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
	id: number

	@ApiProperty({ example: '3', description: 'id of the aroma' })
	@Column({ type: DataType.INTEGER })
	aromaId: number

	@BelongsTo(() => Order)
	order: Order;

	@ApiProperty({ example: '5', description: 'id of the order' })
	@ForeignKey(() => Order)
	@Column
	orderId: number;

	@BelongsTo(() => Product)
	product: Product;

	@ApiProperty({ example: '10', description: 'id of the product' })
	@ForeignKey(() => Product)
	@Column
	productId: number;
}