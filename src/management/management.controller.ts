import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetOrdersDto, UpdateOrderStatusDto } from './dto/management.dto';
import { ManagementService } from './management.service';

@Controller('management')
export class ManagementController {
	constructor(private managementService: ManagementService) {}

	@UseGuards(JwtAuthGuard)
	@Get('orders')
	getOrders(@Query() query: GetOrdersDto) {
		return this.managementService.getOrders(query);
	}

	@UseGuards(JwtAuthGuard)
	@Post('order/status/')
	setOrderStatus(@Body() body: UpdateOrderStatusDto) {
		return this.managementService.changeOrderStatus(body);
	}
}
