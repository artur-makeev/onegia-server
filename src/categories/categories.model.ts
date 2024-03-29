import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Product } from 'src/products/models/products.model';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

interface CategoryCreationAttrs {
	name: string;
}

@Table({ tableName: 'categories', underscored: true })
export class Category extends Model<Category, CategoryCreationAttrs> {
	@ApiProperty({ example: '1', description: 'unique identifier' })
	@Column({
		type: DataType.INTEGER,
		unique: true,
		primaryKey: true,
		autoIncrement: true,
	})
	id: number;

	@ApiProperty({ example: 'Candles', description: 'category name' })
	@Column({ type: DataType.STRING, unique: true, allowNull: false })
	name: string;

	@HasMany(() => Product)
	products: Product[];
}
