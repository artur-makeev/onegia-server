import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsController } from './products.controller';
import { Product } from './models/products.model';
import { ProductsService } from './products.service';
import { Package } from './models/package.model';
import { PackageService } from './package.service';
import { ProductAroma } from './models/product_aroma.model';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PackageService],
  imports: [
    SequelizeModule.forFeature([Product, Package, ProductAroma])
  ],
  exports: [PackageService]
})
export class ProductsModule {}
