import {
  PostgresConnectionOptions
} from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const typeOrmConfig = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  entities: ['dist/**/entities/*.entity.js'],
  migrations: ['dist/**/migration/*.js'],
  migrationsRun: true,
} as PostgresConnectionOptions;
