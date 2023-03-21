import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  const robokassaIps = /185\.59\.216\.([1-9][0-9]?|1[0-9][0-9]|2[0-4][0-9]|25[0-4]){1}/;
  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin ||
        origin === process.env.CP_URL ||
        origin === process.env.CP_URL2 ||
        origin === process.env.CLIENT_URL ||
        origin === process.env.CLIENT_URL2 ||
        robokassaIps.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  });
  const config = new DocumentBuilder()
    .setTitle('Online shop backend')
    .setDescription('REST API documentation')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}
bootstrap();
