import { Module } from '@nestjs/common';
import { CdekService } from './cdek.service';
import { CdekController } from './cdek.controller';
import { HttpModule } from '@nestjs/axios';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    HttpModule,
    ProductsModule
  ],
  providers: [CdekService],
  controllers: [CdekController]
})
export class CdekModule {}
