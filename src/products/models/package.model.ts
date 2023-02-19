import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from './products.model';

interface PackageCreationAttrs {
	name: string,
	price: number,
	img: string,
	description: string
}

@Table({ tableName: 'packages' })
export class Package extends Model<Package, PackageCreationAttrs> {
	@ApiProperty({ example: '1', description: 'unique identifier' })
	@Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
	id: number

	@ApiProperty({ example: '400', description: 'product weight in grams' })
	@Column({ type: DataType.INTEGER, allowNull: false })
	weight: number

	@ApiProperty({ example: '27', description: 'product volume in cm3' })
	@Column({ type: DataType.INTEGER, allowNull: false })
	volume: number

	@BelongsTo(() => Product)
	product: Product;

	@ApiProperty({ example: '1', description: 'id of product' })
	@ForeignKey(() => Product)
	@Column
	product_id: number;
}