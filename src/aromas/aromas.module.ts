import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AromasController } from './aromas.controller';
import { AromasService } from './aromas.service';
import { Aroma } from './aromas_models/aromas.model';
import { AromaCategory } from './aromas_models/aroma_categories.model';
import { AromaDescription } from './aromas_models/aroma_descriptions.model';

@Module({
  controllers: [AromasController],
  providers: [AromasService],
  imports: [
    SequelizeModule.forFeature([Aroma, AromaCategory, AromaDescription]),
  ]
})
export class AromasModule { }
