import { Column, DataType, Model, Table, ForeignKey, HasOne, BelongsTo, BelongsToMany, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { AromaCategory } from './aroma_categories.model';
import { AromaDescription } from './aroma_descriptions.model';
import { Product } from 'src/products/models/products.model';
import { ProductAroma } from 'src/products/models/product_aroma.model';
import { OrderProduct } from 'src/orders/models/order_products.model';

interface AromaCreationAttrs {
	name: string
	aroma_category_id: number
}

@Table({ tableName: 'aromas', underscored: true })
export class Aroma extends Model<Aroma, AromaCreationAttrs> {
	@ApiProperty({ example: '1', description: 'unique identifier' })
	@Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
	id: number;

	@ApiProperty({ example: 'Orange', description: 'aroma name' })
	@Column({ type: DataType.STRING, unique: true, allowNull: false })
	name: string;

	@ApiProperty({ example: '3', description: 'aroma category id' })
	@ForeignKey(() => AromaCategory)
	@Column
	aroma_category_id: number;

	@BelongsTo(() => AromaCategory)
	aroma_category: AromaCategory;

	@HasOne(() => AromaDescription)
	aroma_description: AromaDescription;

	@HasMany(() => OrderProduct)
	order_products: OrderProduct[];

	@BelongsToMany(() => Product, () => ProductAroma)
	products: Product[];
}