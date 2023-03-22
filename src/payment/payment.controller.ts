import { Controller, Post, Body, Query, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger/dist';
import {
	GeneratePaymentUrlDto,
	PaymentConfirmationDto,
} from './dto/payment.dto';
import { Payment } from './interfaces/interfaces';
import { RoboKassaService } from './robokassa.service';
import * as rawbody from 'raw-body';

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
	@Get('results')
	result(@Query() query: PaymentConfirmationDto) {
		return this.roboKassaService.confirmPayment(query);
	}

	@ApiOperation({ summary: 'pament confirmation' })
	@ApiResponse({ status: 201 })
	@Post('result')
	async postResult(@Req() req) {
		const raw = await rawbody(req);
		const text = raw.toString();
		const params = new URLSearchParams(text);
		return this.roboKassaService.confirmPayment({
			OutSum: params.get('OutSum'),
			InvId: params.get('InvId'),
			SignatureValue: params.get('SignatureValue'),
		});
	}
}
