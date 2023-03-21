import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger/dist';
import { ApiTags } from '@nestjs/swagger/dist/decorators';
import { Product } from './models/products.model';
import { ProductsService } from './products.service';
import { GetProductsDto } from './dto/products.dto';

@ApiTags('Products')
@Controller('api/product')
export class ProductsController {

	constructor(
		private productsService: ProductsService,
	) {}

	@ApiOperation({ summary: 'get all products' })
	@ApiResponse({ status: 200, type: [Product] })
	@Get()
	getAll(@Query() query: GetProductsDto) {
		return this.productsService.getAllProducts(query);
	}
}