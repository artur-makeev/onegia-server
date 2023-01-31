import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RoboKassaService } from './robokassa.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, RoboKassaService]
})
export class PaymentModule {}
