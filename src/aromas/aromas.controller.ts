import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger/dist/decorators';
import { AromasService } from './aromas.service';
import { Aroma } from './aromas_models/aromas.model';
import { AromaCategory } from './aromas_models/aroma_categories.model';
import { GetAromaCategoriesDto, GetAromaDescriptionDto, GetAromasDto } from './dto/aroma.dto';
import { ReturnAromaDescription } from './examples/examples';


@ApiTags('Aromas')
@Controller('api/aroma')
export class AromasController {
	constructor(private aromasService: AromasService) {}

	@ApiOperation({ summary: 'get aroma categories by product category' })
	@ApiResponse({ status: 200, type: [AromaCategory] })
	@Get(':categoryId')
	getCategories(@Param() reqParam: GetAromaCategoriesDto) {
		return this.aromasService.getAromaCategories(reqParam.categoryId);
	}

	@ApiOperation({ summary: 'get aromas by aroma category' })
	@ApiResponse({ status: 200, type: [Aroma] })
	@Get('category/:aromaCategoryId')
	getAromas(@Param() reqParam: GetAromasDto) {
		return this.aromasService.getAromas(reqParam.aromaCategoryId);
	}

	@ApiOperation({ summary: 'get aroma description' })
	@ApiResponse({ status: 200, description: ReturnAromaDescription })
	@Get('info/:aromaId')
	getDescription(@Param() reqParam: GetAromaDescriptionDto) {
		return this.aromasService.getAromaInfo(reqParam.aromaId);
	}
}
