import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger/dist';
import {
	GeneratePaymentUrlDto,
	PaymentConfirmationDto,
} from './dto/payment.dto';
import { Payment } from './interfaces/interfaces';
import { RoboKassaService } from './robokassa.service';

@Controller('api/payment')
export class PaymentController {
	constructor(private roboKassaService: RoboKassaService) {}

	@ApiOperation({ summary: 'generate payment link' })
	@ApiResponse({ status: 201 })
	@Post('link')
	generate(@Body() body: GeneratePaymentUrlDto): Payment {
		return this.roboKassaService.generatePaymentUrl(body);
	}

	@ApiOperation({ summary: 'pament confirmation' })
	@ApiResponse({ status: 201 })
	@Get('result')
	result(@Query() query: PaymentConfirmationDto) {
		return this.roboKassaService.confirmPayment(query);
	}
}
