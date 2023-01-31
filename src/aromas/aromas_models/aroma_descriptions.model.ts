import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Aroma } from './aromas.model';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

interface AromaDescriptionCreationAttrs {
	top: string
	heart: string
	base: string
}

@Table({ tableName: 'aroma_descriptions' })
export class AromaDescription extends Model<AromaDescription, AromaDescriptionCreationAttrs> {
	@ApiProperty({ example: '1', description: 'unique identifier' })
	@Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
	id: number

	@ApiProperty({ example: 'honey', description: 'top flavor' })
	@Column({ type: DataType.STRING })
	top: string

	@ApiProperty({ example: 'strawberries', description: 'heart flavor' })
	@Column({ type: DataType.STRING })
	heart: string

	@ApiProperty({ example: 'cake', description: 'base flavor' })
	@Column({ type: DataType.STRING })
	base: string

	@BelongsTo(() => Aroma)
	aroma: Aroma;

	@ForeignKey(() => Aroma)
	@Column
	aromaId: number;
}