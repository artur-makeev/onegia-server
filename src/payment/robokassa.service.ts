import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MailService } from 'src/mail_service/mail.service';
import { Order } from 'src/orders/models/orders.model';
import { OrderPrice } from 'src/orders/models/order_prices.model';
let crypto;
try {
	crypto = require('node:crypto');
} catch (err) {
	console.log('crypto support is disabled!');
}

import { GeneratePaymentUrlDto, PaymentConfirmationDto } from './dto/payment.dto';
import { Payment } from './interfaces/interfaces';


interface Config {
	merchantLogin: string,
	hashingAlgorithm: string,
	password1: string,
	password2: string,
	testPassword1: string,
	testPassword2: string,
	testMode: boolean,
	resultUrlRequestMethod: 'POST',
	paymentUrlTemplate: string,
	encoding: 'UTF-8',
	description: string
	taxSystem: string
}

@Injectable()
export class RoboKassaService {
	private config: Config

	constructor(
		@Inject(MailService) private mailService: MailService,
		@InjectModel(Order) private orderRepository: typeof Order,
		@InjectModel(OrderPrice) private orderPriceRepository: typeof OrderPrice
	) {
		this.config = {
			merchantLogin: process.env.ROBOKASSA_LOGIN,
			hashingAlgorithm: 'md5',
			password1: process.env.ROBOKASSA_PASSWORD_1,
			password2: process.env.ROBOKASSA_PASSWORD_2,
			testPassword1: process.env.ROBOKASSA_TEST_PASSWORD_1,
			testPassword2: process.env.ROBOKASSA_TEST_PASSWORD_2,
			testMode: Boolean(+process.env.ROBOKASSA_TEST_MODE),
			resultUrlRequestMethod: 'POST',
			paymentUrlTemplate: process.env.ROBOKASSA_API_URL,
			encoding: 'UTF-8',
			description: process.env.ROBOKASSA_PAYMENT_DESC,
			taxSystem: process.env.ROBOKASSA_TAX_SYSTEM,
		}
	}

	generatePaymentUrl({ outSum, invId, items }: GeneratePaymentUrlDto): Payment {
		const receipt = {
			sno: this.config.taxSystem,
			items: items
		}

		const receiptURI = encodeURIComponent(JSON.stringify(receipt));

		const payment: Payment = {
			url: this.config.paymentUrlTemplate,
			params: {
				MerchantLogin: this.config.merchantLogin,
				OutSum: outSum,
				Description: this.config.description,
				SignatureValue: this.calculateSignature(outSum, invId, receiptURI),
				InvId: invId,
				Encoding: this.config.encoding,
				Receipt: encodeURIComponent(receiptURI)
			}
		}

		if (this.config.testMode) {
			payment.params.IsTest = '1';
		}

		return payment;
	}

	calculateSignature(outSum: string, invId: string, receiptURI: string): string {
		const password = this.config.testMode ? this.config.testPassword1 : this.config.password1
		const signature = `${this.config.merchantLogin}:${outSum}:${invId}:${receiptURI}:${password}`

		return this.calculateHash(signature);
	}

	calculateHash(value: string): string {
		const hash = crypto.createHash(this.config.hashingAlgorithm);
		hash.update(value);

		return hash.digest('hex');
	}


	async confirmPayment({ OutSum, InvId, SignatureValue }: PaymentConfirmationDto) {

		if (this.validateSignature(SignatureValue, OutSum, InvId)) {
			const orderCost = await this.orderPriceRepository.findOne({ where: { order_id: InvId } });
			if ((orderCost.price + orderCost.shipping_price) === +OutSum) {
				let order = await this.orderRepository.findOne({ where: { id: InvId } })
				order.set({ status: 'Оплачен' });
				order = await order.save();
				this.mailService.orderPaidNotificationToAdmin(InvId, parseInt(OutSum));
				return `OK${InvId}`;
			}
			return 'order sum doesnt match';
		}
		return 'bad sign';

	}


	validateSignature(signature: string, outSum: string, invId: string): boolean {
		return (signature.toLowerCase() == this.calculateResultUrlHash(outSum, invId).toLowerCase());
	}

	calculateResultUrlHash(outSum: string, invId: string): string {
		const password = this.config.testMode ? this.config.testPassword2 : this.config.password2;

		return this.calculateHash(`${outSum}:${invId}:${password}`);

	}


}
