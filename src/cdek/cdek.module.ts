import { Module } from '@nestjs/common';
import { CdekService } from './cdek.service';
import { CdekController } from './cdek.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule
  ],
  providers: [CdekService],
  controllers: [CdekController]
})
export class CdekModule {}
