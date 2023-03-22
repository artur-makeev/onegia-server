import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Aroma } from 'src/aromas/aromas_models/aromas.model';
import { MailService } from './mail.service';

@Module({
	providers: [MailService],
	imports: [SequelizeModule.forFeature([Aroma])],
	exports: [MailService],
})
export class MailModule {}
