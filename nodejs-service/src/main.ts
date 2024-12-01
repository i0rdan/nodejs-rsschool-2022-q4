import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { LoggingService } from './shared/services/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new LoggingService(),
  });
  const config = new DocumentBuilder()
    .setTitle('REST SERVICE')
    .setDescription('Home music service')
    .build();
  const doc = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, doc);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
