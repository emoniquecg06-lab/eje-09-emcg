import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';// imports de swagger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // configuración swagger
  const config = new DocumentBuilder()
    .setTitle('SAES')
    .setDescription('API publica del sistema de control escolar')
    .setVersion('1.0')
    .addTag('saes')
    .addBearerAuth() // para JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // endpoint: /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
