import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Aroma } from '../aromas/aromas_models/aromas.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		@InjectModel(Aroma) private aromaRepository: typeof Aroma
	) {}

	private async emailData(orderWithProducts) {
		const products = orderWithProducts.map((item) => {
			return {
				productName: item['product.name'],
				productAroma: item.aromaId,
				productPrice: item['product.price'],
				count: 1,
			}
		});

		const productsCounted = products.reduce((acc, cur) => {
			if (acc.some(item => {
				if (+item.productAroma === +cur.productAroma) {
					item.count++;
					return true;
				}
			})) {
				return acc;
			} else {
				acc.push(cur)
				return acc;
			}
		}, []);

		let productsText = '';
		for await (const item of productsCounted) {
			const aromaRaw = await this.aromaRepository.findOne({
				where: { id: item.productAroma },
				raw: true,
			})
			const aromaName = aromaRaw.name;
			productsText += `<li>${item.productName}, аромат: ${aromaName}, цена:${item.productPrice} ₽, количество: ${item.count} шт.</li>`
		}

		const totalPrice = productsCounted.reduce((sum, cur) => {
			return sum += (+cur.count * +cur.productPrice)
		}, 0);

		const totalCount = productsCounted.reduce((sum, cur) => {
			return sum += +cur.count;
		}, 0);

		return { productsText: productsText, totalPrice: totalPrice, totalCount: totalCount };
	}

	public async sendOrderNotificationToAdmin(orderId, lastName, firstName, fatherName, email, phone, address, contact, orderWithProducts) {
		const { productsText, totalPrice, totalCount } = await this.emailData(orderWithProducts);
		const shipping = address === 'pickup' ?
			'<p>Самовывоз в тц "Пирамида"</p>'
			:
			`<p>Адрес пункта СДЭК: ${address}</p>`
		try {
			await this.mailerService.sendMail({
				from: process.env.SMTP_USER,
				to: process.env.CLIENT_SERVICE_EMAIL,
				subject: `Новый заказ №${orderId}`,
				text: '',
				html:
					`
					<div>
						<h1>Поступил новый заказ №${orderId}<h1>
						<p>Покупатель: ${lastName} ${firstName} ${fatherName}</p>
						<p>Электронная почта: ${email}
						<p>Телефон: ${phone}</p>
						${shipping}
						<p>Предпочтение по связи: ${contact}</p>
						<p>Товары:<p>
						<ul>
						${productsText}
						</ul>
						<p>Всего ${totalCount} шт. на сумму ${totalPrice} ₽</p>
					</div>
				`
			})
		} catch (e) {
			console.log('Email to admin failed:')
			console.log(e.message);
		}

	}

	public async sendOrderNotificationToClient(orderId, lastName, firstName, fatherName, email, phone, address, orderWithProducts) {
		const { productsText, totalPrice, totalCount } = await this.emailData(orderWithProducts);
		const shipping = address === 'pickup' ?
			'<p>После готовности заказ можно будет забрать в магазине "Твоя полка" в тц "Пирамида" по адресу: ул.Кирова д.19а (ежедневно с 10:00 до 20:00)</p>'
			:
			`<p>Адрес пункта СДЭК: ${address}</p>`
		try {
			await this.mailerService.sendMail({
				from: process.env.SMTP_USER,
				to: email,
				subject: `Заказ в интернет-магазине ${process.env.COMPANY_NAME} принят`,
				text: '',
				html:
					`	<head>
						<style>
							body {
								font-family: 'Facundo', sans-serif;
							}

							button {
								padding: 10px;
								font-size: 20px;
								background-color: transparent;
								cursor: pointer;
								border: 1px solid black;
							}
							button a {
  								text-decoration: none;
							}
						</style>
					</head>
					<body>
						<p>Здравствуйте, ${firstName}!</p>
						<p>Ваш заказ №${orderId} принят.</p>
						<p>В ближайшее время с Вами свяжется менеджер для обсуждения делатей доставки и оплаты.</p>
						<p>Информация о заказе:</p>
						<p>Покупатель: ${lastName} ${firstName} ${fatherName}</p>
						<p>Телефон: ${phone}</p>
						${shipping}
						<p>Товары:<p>
						<ul>
						${productsText}
						</ul>
						<p>Всего ${totalCount} шт. на сумму ${totalPrice} ₽</p>
						<p>При наличии вопросов обращайтесь по адресу: ${process.env.CLIENT_SERVICE_EMAIL}</p>
						<p>Команда <a href=${process.env.CLIENT_URL}>${process.env.COMPANY_NAME}</a></p>
					</body>
				`
			})
		} catch (e) {
			console.log('Email to client failed:')
			console.log(e.message);
		}
	}
}