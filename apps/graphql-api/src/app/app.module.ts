import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from '../constants';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DrizzleModule,
    ClientsModule.register([
      // Register client on api-gateway for TCP channel.
      {
        name: MICROSERVICES_CLIENTS.SYNC_SCORE_SERVICE_CLIENT,
        transport: Transport.TCP,
        options: {
          port: 3004,
        },
      },
      // Register client on api-gateway for KAFKA channel.
      {
        name: MICROSERVICES_CLIENTS.KAFKA_SERCVICE_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'], // address of the KAFKA server
          },
        },
      },
      // Register client on api-gateway for REDIS channel.
      {
        name: MICROSERVICES_CLIENTS.REDIS_SERVICE_CLIENT,
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
