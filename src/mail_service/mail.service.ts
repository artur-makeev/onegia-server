import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Aroma } from '../aromas/aromas_models/aromas.model';
import { InjectModel } from '@nestjs/sequelize';
import { daySpelling } from './helpers/daySpelling';

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		@InjectModel(Aroma) private aromaRepository: typeof Aroma,
	) {}

	private async emailData(orderWithProducts) {
		const products = orderWithProducts.map(item => {
			return {
				productName: item['product.name'],
				productAroma: item.aroma_id,
				productPrice: item['product.price'],
				count: 1,
			};
		});

		const productsCounted = products.reduce((acc, cur) => {
			if (
				acc.some(item => {
					if (
						item.productName === cur.productName &&
						+item.productAroma === +cur.productAroma
					) {
						item.count++;
						return true;
					}
				})
			) {
				return acc;
			} else {
				acc.push(cur);
				return acc;
			}
		}, []);

		let productsText = '';
		for await (const item of productsCounted) {
			const aromaRaw = await this.aromaRepository.findOne({
				where: { id: item.productAroma },
				raw: true,
			});
			const aromaName = aromaRaw.name;
			productsText += `<li>${item.productName}, аромат: ${aromaName}, цена: ${item.productPrice} ₽, количество: ${item.count} шт.</li>`;
		}

		const totalProductsPrice = productsCounted.reduce((sum, cur) => {
			return (sum += +cur.count * +cur.productPrice);
		}, 0);

		const totalCount = productsCounted.reduce((sum, cur) => {
			return (sum += +cur.count);
		}, 0);

		return {
			productsText: productsText,
			totalProductsPrice: totalProductsPrice,
			totalCount: totalCount,
		};
	}

	public async orderPaidNotificationToAdmin(orderId, sum) {
		try {
			await this.mailerService.sendMail({
				from: process.env.SMTP_USER,
				to: process.env.CLIENT_SERVICE_EMAIL,
				subject: `Заказ №${orderId} оплачен`,
				text: '',
				html: `
					<div>
						<h1>Поступила оплата по заказу №${orderId}<h1>
						<p>Сумма оплаты :${sum} руб.</p>
					</div>
					`,
			});
		} catch (e) {
			console.log(e.message);
		}
	}

	public async sendOrderNotificationToAdmin(
		orderId,
		lastName,
		firstName,
		fatherName,
		email,
		phone,
		address,
		shippingType,
		shippingTime,
		shippingPrice,
		contact,
		orderWithProducts,
	) {
		const { productsText, totalProductsPrice, totalCount } =
			await this.emailData(orderWithProducts);
		let deliveryDetails = '';
		let deliveryPrice = '';
		let totalPrice = '';

		switch (shippingType) {
			case 'pickup':
				deliveryDetails = '<p>Самовывоз с Ригачина 47</p>';
				break;
			case 'cdek':
				deliveryDetails = `<p>Выбран пункт СДЭК: ${address}</p>\
				<p>Доставка займет ${shippingTime} ${daySpelling(shippingTime)}</p>`;
				deliveryPrice = `<p>Стоимость доставки: ${shippingPrice} ₽</p>`;
				totalPrice = `<p>Общая стоимость: ${
					parseInt(totalProductsPrice) + parseInt(shippingPrice)
				} ₽</p>`;
				break;
			case 'yandex':
				deliveryDetails = '<p>Яндекс Доставка</p>';
				break;
			default:
				console.log('mailservice shippingType error');
				break;
		}

		try {
			await this.mailerService.sendMail({
				from: process.env.SMTP_USER,
				to: process.env.CLIENT_SERVICE_EMAIL,
				subject: `Новый заказ №${orderId}`,
				text: '',
				html: `
					<body>
						<h1>Поступил новый заказ №${orderId}<h1>
						<p>Покупатель: ${lastName} ${firstName} ${fatherName}</p>
						<p>Электронная почта: ${email}
						<p>Телефон: ${phone}</p>
						${deliveryDetails}
						<p>Предпочтение по связи: ${contact}</p>
						<p>Товары:<p>
						<ul>
						${productsText}
						</ul>
						<p>Всего ${totalCount} шт. на сумму ${totalProductsPrice} ₽</p>
						${deliveryPrice}
						${totalPrice}
					</body>
					`,
			});
		} catch (e) {
			console.log('Email to admin failed:');
			console.log(e.message);
		}
	}

	public async sendOrderNotificationToClient(
		orderId,
		lastName,
		firstName,
		fatherName,
		email,
		phone,
		address,
		shippingType,
		shippingTime,
		shippingPrice,
		orderWithProducts,
	) {
		const { productsText, totalProductsPrice, totalCount } =
			await this.emailData(orderWithProducts);
		let deliveryDetails = '';
		let deliveryPrice = '';
		let totalPrice = '';
		let deliveryTime = '';

		switch (shippingType) {
			case 'pickup':
				deliveryDetails = `<p>Самовывоз осуществляется по адресу: ул. Ригачина, д. 47. Время оговаривается с менеджером.</p>`;
				break;
			case 'cdek':
				deliveryDetails = `<p>Выбран пункт СДЭК: ${address}</p>`;
				deliveryTime = `<p>Доставка займет ${shippingTime} ${daySpelling(
					shippingTime,
				)} </p>`;
				deliveryPrice = `<p>Стоимость доставки: ${shippingPrice} ₽</p>`;
				totalPrice = `<p>Общая стоимость: ${
					parseInt(totalProductsPrice) + parseInt(shippingPrice)
				} ₽</p>`;
				break;
			case 'yandex':
				deliveryDetails = '<p>Заказ будет направлен Яндекс доставкой</p>';
				deliveryPrice = '<p>Доставка оплачивается отдельно</p>';
				break;
			default:
				console.log('mailservice shippingType error');
				break;
		}

		try {
			await this.mailerService.sendMail({
				from: process.env.SMTP_USER,
				to: email,
				subject: `Заказ в интернет-магазине ${process.env.COMPANY_NAME} принят`,
				text: '',
				html: `
					<body>
						<p>Здравствуйте, ${firstName}!</p>
						<p>Ваш заказ №${orderId} принят.</p>
						<p>Информация о заказе:</p>
						<p>Покупатель: ${lastName} ${firstName} ${fatherName}</p>
						<p>Телефон: ${phone}</p>
						${deliveryDetails}
						<p>Производство займет 3 дня</p>
						${deliveryTime}
						<p>Товары:<p>
						<ul>
						${productsText}
						</ul>
						<p>Всего ${totalCount} шт. на сумму ${totalProductsPrice} ₽</p>
						${deliveryPrice}
						${totalPrice}
						<p>При наличии вопросов обращайтесь по адресу: ${process.env.CLIENT_SERVICE_EMAIL}</p>
						<p>Команда <a href=${process.env.CLIENT_URL}>${process.env.COMPANY_NAME}</a></p>
					</body>
				`,
			});
		} catch (e) {
			console.log('Email to client failed:');
			console.log(e.message);
		}
	}
}
