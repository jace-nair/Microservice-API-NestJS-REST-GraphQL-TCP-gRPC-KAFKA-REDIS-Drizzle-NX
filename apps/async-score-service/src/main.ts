/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  // Listens over KAFKA channel to API gateway
  const kafkaMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          // groupId defines which consumer group this service belong to
          groupId: 'order-consumer-group',
        },
      },
    });
  await kafkaMicroservice.listen();
  Logger.log(`🚀 Async Score Service is running on KAFKA channel:9092`);
}

bootstrap();
