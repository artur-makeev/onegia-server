import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Column, DataType, Model, Table, ForeignKey } from 'sequelize-typescript';
import { Aroma } from 'src/aromas/aromas_models/aromas.model';
import { Product } from './products.model';

interface ProductAromaCreationAttrs {
	productId: number,
	aromaId: number
}

@Table({ tableName: 'products_aromas', underscored: true })
export class ProductAroma extends Model<ProductAroma, ProductAromaCreationAttrs> {
	@ApiProperty({ example: '1', description: 'unique identifier' })
	@Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
	id: number;

	@ApiProperty({ example: '1', description: 'product id' })
	@ForeignKey(() => Product)
	@Column
	product_id: number;

	@ApiProperty({ example: '2', description: 'aroma id' })
	@ForeignKey(() => Aroma)
	@Column
	aroma_id: number;
}