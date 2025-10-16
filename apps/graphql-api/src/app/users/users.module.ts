import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from '../../constants';
import { USERS_PACKAGE_NAME } from '../../types/proto/users';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      // Register client on api-gateway for TCP channel.
      {
        name: MICROSERVICES_CLIENTS.SYNC_SCORE_SERVICE_CLIENT,
        transport: Transport.TCP,
        options: {
          port: 3004,
        },
      },
      {
        // Register client on api-gateway for gRPC channel.
        name: MICROSERVICES_CLIENTS.GSYNC_SCORE_SERVICE_CLIENT,
        transport: Transport.GRPC,
        options: {
          package: USERS_PACKAGE_NAME,
          protoPath: join(__dirname, 'proto/users.proto'),
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
  ],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
