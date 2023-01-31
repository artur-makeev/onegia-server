import { Controller, Post, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger/dist';
import { GeneratePaymentUrlDto, PaymentConfirmationDto } from './dto/payment.dto';
import { PaymentService } from './payment.service';
import { RoboKassaService } from './robokassa.service';

@Controller('api/payment')
export class PaymentController {
	constructor(
		private paymentService: PaymentService,
		private roboKassaService: RoboKassaService
	) {}

	@ApiOperation({ summary: 'generate payment link' })
	@ApiResponse({ status: 201 })
	@Post('link')
	generate(@Body() body: GeneratePaymentUrlDto) {
		return this.roboKassaService.generatePaymentUrl(body);
	}

	@ApiOperation({ summary: 'pament confirmation' })
	@ApiResponse({ status: 201 })
	@Post('result')
	result(@Query() query: PaymentConfirmationDto) {
		console.log(query)
		return this.roboKassaService.confirmPayment(query);
	}



}
