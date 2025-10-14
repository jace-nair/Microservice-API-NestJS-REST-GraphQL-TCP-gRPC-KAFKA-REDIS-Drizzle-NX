import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../../db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ConfigService } from '@nestjs/config';

// Export a string token to be used with database
export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';

// An array with a NestJS provider definition
export const drizzleProvider = [
  {
    provide: DRIZZLE_PROVIDER,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const connectionString = configService.get<string>('DATABASE_URL');
      if (!connectionString) {
        throw new Error('DATABASE_URL is not defined in environment variables');
      }

      const pool = new Pool({ connectionString });
      await pool.connect(); // ✅ validate connection

      return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
    },
  },
];
