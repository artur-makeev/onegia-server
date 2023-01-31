import { Column, DataType, Model, Table, ForeignKey, HasOne, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { AromaCategory } from './aroma_categories.model';
import { AromaDescription } from './aroma_descriptions.model';

interface AromaCreationAttrs {
	name: string
}

@Table({ tableName: 'aromas' })
export class Aroma extends Model<Aroma, AromaCreationAttrs> {
	@ApiProperty({ example: '1', description: 'unique identifier' })
	@Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
	id: number

	@ApiProperty({ example: 'Orange', description: 'aroma name' })
	@Column({ type: DataType.STRING, allowNull: false })
	name: string

	@BelongsTo(() => AromaCategory)
	aromaCategory: AromaCategory;

	@ForeignKey(() => AromaCategory)
	@Column
	aromaCategoryId: number;

	@HasOne(() => AromaDescription)
	aromaDescription: AromaDescription;
}