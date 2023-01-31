import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
	async makePayment(body) {
		return body;
	}

	async paymentResult(body) {
		console.log('payment result')
		console.log(body)
		return body;
	}
}
