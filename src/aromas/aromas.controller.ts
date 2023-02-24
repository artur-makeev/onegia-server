import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger/dist/decorators';
import { AromasService } from './aromas.service';
import { Aroma } from './aromas_models/aromas.model';
import { GetAromaDescriptionDto, GetAromasByCategoryDto, GetAromasByProductDto } from './dto/aroma.dto';
import { ReturnAromaDescription } from './examples/examples';


@ApiTags('Aromas')
@Controller('api/aroma')
export class AromasController {
	constructor(private aromasService: AromasService) {}

	@ApiOperation({ summary: 'get aromas by aromas by product id' })
	@ApiResponse({ status: 200, type: [Aroma] })
	@Get('/:product_id')
	getAromasByProduct(@Param() reqParam: GetAromasByProductDto) {
		return this.aromasService.getAromasByProduct(reqParam.product_id);
	}


	@ApiOperation({ summary: 'get aromas by aroma category' })
	@ApiResponse({ status: 200, type: [Aroma] })
	@Get('category/:aromaCategoryId')
	getAromas(@Param() reqParam: GetAromasByCategoryDto) {
		return this.aromasService.getAromas(reqParam.aromaCategoryId);
	}

	@ApiOperation({ summary: 'get aroma description' })
	@ApiResponse({ status: 200, description: ReturnAromaDescription })
	@Get('info/:aromaId')
	getDescription(@Param() reqParam: GetAromaDescriptionDto) {
		return this.aromasService.getAromaInfo(reqParam.aromaId);
	}
}
