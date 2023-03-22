import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import {
	Column,
	DataType,
	Model,
	Table,
	ForeignKey,
	HasMany,
	BelongsTo,
	BelongsToMany,
	HasOne,
} from 'sequelize-typescript';
import { Aroma } from 'src/aromas/aromas_models/aromas.model';
import { Category } from 'src/categories/categories.model';
import { OrderProduct } from 'src/orders/models/order_products.model';
import { Package } from './package.model';
import { ProductAroma } from './product_aroma.model';

interface ProductCreationAttrs {
	name: string;
	price: number;
	img: string;
	description: string;
	category_id: number;
}

@Table({ tableName: 'products', underscored: true })
export class Product extends Model<Product, ProductCreationAttrs> {
	@ApiProperty({ example: '1', description: 'unique identifier' })
	@Column({
		type: DataType.INTEGER,
		unique: true,
		primaryKey: true,
		autoIncrement: true,
	})
	id: number;

	@ApiProperty({ example: 'Candle', description: 'product name' })
	@Column({ type: DataType.STRING, unique: true, allowNull: false })
	name: string;

	@ApiProperty({ example: '400', description: 'product price' })
	@Column({ type: DataType.INTEGER, allowNull: false })
	price: number;

	@ApiProperty({ example: 'candle.png', description: 'product image name' })
	@Column({ type: DataType.STRING, allowNull: false })
	img: string;

	@ApiProperty({
		example: 'with added flavors',
		description: 'product description',
	})
	@Column({ type: DataType.STRING })
	description: string;

	@BelongsTo(() => Category)
	category: Category;

	@ApiProperty({ example: '1', description: 'id of product category' })
	@ForeignKey(() => Category)
	@Column
	category_id: number;

	@HasOne(() => Package)
	product: Product;

	@HasMany(() => OrderProduct)
	order_product: number;

	@BelongsToMany(() => Aroma, () => ProductAroma)
	aromas: Aroma[];
}
