import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from 'src/products/models/products.model';
import { Order } from './orders.model';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Aroma } from 'src/aromas/aromas_models/aromas.model';

interface OrderProductCreationAttrs {
	order_id: number
	product_id: number
	aroma_id: number
}

@Table({ tableName: 'order_products', underscored: true })
export class OrderProduct extends Model<OrderProduct, OrderProductCreationAttrs> {
	@ApiProperty({ example: '1', description: 'unique identifier' })
	@Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
	id: number;

	@ApiProperty({ example: '3', description: 'id of the aroma' })
	@ForeignKey(() => Aroma)
	@Column(DataType.INTEGER)
	aroma_id: Aroma;

	@BelongsTo(() => Aroma)
	aroma: Aroma;

	@ApiProperty({ example: '5', description: 'id of the order' })
	@ForeignKey(() => Order)
	@Column
	order_id: number;

	@BelongsTo(() => Order)
	order: Order;

	@ApiProperty({ example: '10', description: 'id of the product' })
	@ForeignKey(() => Product)
	@Column
	product_id: number;

	@BelongsTo(() => Product)
	product: Product;
}