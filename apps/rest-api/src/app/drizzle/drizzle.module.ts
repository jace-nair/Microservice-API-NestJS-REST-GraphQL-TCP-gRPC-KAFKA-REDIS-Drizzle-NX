import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { drizzleProvider } from './drizzle';

@Module({
  imports: [ConfigModule], // make ConfigService available
  providers: [...drizzleProvider], // register provider
  exports: [...drizzleProvider], // export provider so other modules can inject it
})
export class DrizzleModule {}
