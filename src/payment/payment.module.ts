import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from 'src/orders/orders_models/orders.model';
import { PaymentController } from './payment.controller';
import { RoboKassaService } from './robokassa.service';

@Module({
  controllers: [PaymentController],
  providers: [RoboKassaService],
  imports: [
    SequelizeModule.forFeature([Order])
  ]
})
export class PaymentModule {}
