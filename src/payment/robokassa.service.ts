import { Injectable } from '@nestjs/common';
let crypto;
try {
	crypto = require('node:crypto');
} catch (err) {
	console.log('crypto support is disabled!');
}

import { GeneratePaymentUrlDto, PaymentConfirmationDto } from './dto/payment.dto';

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
	encoding: 'UTF-8'
}

@Injectable()
export class RoboKassaService {
	private config: Config

	constructor() {
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
			encoding: 'UTF-8'
		}
	}

	generatePaymentUrl({ outSum, description, invId }: GeneratePaymentUrlDto): string {
		const payURL = new URL(this.config.paymentUrlTemplate);

		payURL.searchParams.append('MerchantLogin', this.config.merchantLogin);
		payURL.searchParams.append('OutSum', outSum);
		payURL.searchParams.append('Description', description);
		payURL.searchParams.append('SignatureValue', this.calculateSignature(outSum, invId));
		payURL.searchParams.append('InvId', invId);
		payURL.searchParams.append('Encoding', this.config.encoding);

		if (this.config.testMode) {
			payURL.searchParams.append('IsTest', '1');
		}

		return payURL.href;
	}

	calculateSignature(outSum: string, invId: string): string {
		const password = this.config.testMode ? this.config.testPassword1 : this.config.password1
		const signature = `${this.config.merchantLogin}:${outSum}:${invId}:${password}`

		return this.calculateHash(signature);
	}

	calculateHash(value: string): string {
		const hash = crypto.createHash(this.config.hashingAlgorithm);
		hash.update(value);

		return hash.digest('hex');
	}


	confirmPayment({ OutSum, InvId, SignatureValue }: PaymentConfirmationDto) {

		if (this.validateSignature(SignatureValue, OutSum, InvId)) {
			console.log('payment confirmed')
			return `OK${InvId}`
		}
		return 'bad sign'

	}


	validateSignature(signature: string, outSum: string, invId: string): boolean {
		return (signature.toLowerCase() == this.calculateResultUrlHash(outSum, invId).toLowerCase());
	}

	calculateResultUrlHash(outSum: string, invId: string): string {
		const password = this.config.testMode ? this.config.testPassword2 : this.config.password2;

		return this.calculateHash(`${outSum}:${invId}:${password}`);

	}


}
