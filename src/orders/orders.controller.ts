import { Body, Controller, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { Post, UsePipes } from '@nestjs/common/decorators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger/dist/decorators';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/order.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Orders')
@Controller('api/order')
export class OrdersController {

	constructor(private ordersService: OrdersService) {}

	@ApiOperation({ summary: 'create order' })
	@ApiResponse({ status: 200 })
	@Post()
	@UsePipes(new ValidationPipe())
	@UseInterceptors(FileInterceptor('file'))
	create(@Body() body: CreateOrderDto) {
		return this.ordersService.createOrder(body)
	}
}
