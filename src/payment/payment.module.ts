import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MailModule } from 'src/mail_service/mail_service.module';
import { Order } from 'src/orders/models/orders.model';
import { OrderPrice } from 'src/orders/models/order_prices.model';
import { PaymentController } from './payment.controller';
import { RoboKassaService } from './robokassa.service';

@Module({
	controllers: [PaymentController],
	providers: [RoboKassaService],
	imports: [MailModule, SequelizeModule.forFeature([Order, OrderPrice])],
})
export class PaymentModule {}
