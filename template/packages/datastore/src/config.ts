import { getLogger } from '@riffcraft/logger';

const logger = getLogger();

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
  ssl?: boolean | { rejectUnauthorized: boolean };
}

export function getDatabaseConfig(): DatabaseConfig {
  const config: DatabaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'riffcraft',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: Number.parseInt(process.env.DB_POOL_MAX || '10', 10),
    idleTimeoutMillis: Number.parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: Number.parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000', 10),
  };

  // SSL configuration for production
  if (process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true') {
    config.ssl =
      process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false' ? { rejectUnauthorized: false } : true;
  }

  // Validate required fields
  if (!config.password && process.env.NODE_ENV === 'production') {
    logger.warn('Database password not set for production environment');
  }

  return config;
}

export function getConnectionString(config?: DatabaseConfig): string {
  const cfg = config || getDatabaseConfig();
  const sslParam = cfg.ssl ? '?sslmode=require' : '';
  return `postgresql://${cfg.user}:${cfg.password}@${cfg.host}:${cfg.port}/${cfg.database}${sslParam}`;
}
