import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger/dist/decorators';
import { Category } from './categories.model';
import { CategoriesService } from './categories.service';


@ApiTags('Products')
@Controller('api/category')
export class CategoriesController {
	constructor(private categoriesService: CategoriesService) {}

	@ApiOperation({ summary: 'get all categories' })
	@ApiResponse({ status: 200, type: [Category] })
	@Get()
	getAll() {
		return this.categoriesService.getAllCategories();
	}
}
