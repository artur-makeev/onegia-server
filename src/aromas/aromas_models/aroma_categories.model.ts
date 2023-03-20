import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Aroma } from './aromas.model';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

interface AromaCategoriesCreationAttrs {
	name: string
}

@Table({ tableName: 'aroma_categories', underscored: true })
export class AromaCategory extends Model<AromaCategory, AromaCategoriesCreationAttrs> {
	@ApiProperty({ example: '1', description: 'unique identifier' })
	@Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
	id: number;

	@ApiProperty({ example: 'Fresh', description: 'aroma category name' })
	@Column({ type: DataType.STRING, allowNull: false })
	name: string;

	@HasMany(() => Aroma)
	aromas: Aroma[];
}