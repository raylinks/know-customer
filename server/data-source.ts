import { config } from 'dotenv';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { type SeederOptions } from 'typeorm-extension';
config();

let ormConfig: DataSourceOptions & SeederOptions;

if (process.env.BACKEND_ENV === 'dev') {
  ormConfig = {
    name: 'dev',
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: 5434,
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? 'laravel88',
    database: process.env.DB_NAME ?? 'kyc',
    synchronize: false,
    logging: false,
    migrationsRun: true,
    seeds: ['dist/database/seeding/seeds/**/*.ts'],
    //entities: ['dist/database/entity/**/*.ts'],
    entities: ['server/api/database/**/*.entity{.ts,.js}'],
    // migrations: ['dist/database/migration/**/*.ts'],
    //entities: ['{src,dist}/database/entity/*.entity{.ts,.js}'],
    migrations: ['{src, dist}/database/migrations/*{.ts,.js}'],
    subscribers: ['dist/database/subscriber/**/*.ts'],
    extra: {
      connectionLimit: 10,
    },
  };
} else if (process.env.ENV === 'test') {
  ormConfig = {
    name: 'default',
    type: 'postgres',
    host: process.env.TEST_DATABASE_HOST ?? 'localhost',
    port: 5434,
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.TEST_DATABASE_PASSWORD ?? 'laravel88',
    database: process.env.TEST_DB_NAME ?? 'app-test',
    synchronize: true,
    logging: false,
    // entities: ['.server/api/database/**/*.entity{.ts,.js}'],
    // migrations: ['server/api/database/migrations/*.{ts,js}'],
    entities: ['{src,dist}/*/entities/.entity{.ts,.js}'],
    migrations: ['{src, dist}/migrations/*{.ts,.js}'],
    subscribers: ['server/api/database/subscriber/**/*.ts'],
    seeds: ['server/api/database/seeding/seeds/**/*.ts'],
    extra: {
      connectionLimit: 10,
    },
  };
} else {
  ormConfig = {
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: 5434,
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? 'laravel88',
    database: process.env.DB_NAME ?? 'kyc',
    synchronize: true,
    logging: false,
    //entities: ['server/api/database/**/*.entity{.ts,.js}'],
    entities: ['server/api/database/**/*.entity{.ts,.js}'],
    //entities: ['dist/database/entity/**/*.ts'],
    // migrations: ['server/api/database/migrations/*.{ts,js}'],
    //entities: ['{src,dist}/**/entity/*.entity{.ts,.js}'],
    migrations: ['{src, dist}/database/migrations/*{.ts,.js}'],
    subscribers: ['server/api/database/subscriber/**/*.ts'],
    seeds: ['server/api/database/seeding/seeds/**/*.ts'],
    extra: {
      connectionLimit: 10,
    },
  };
}

export const dataSource = new DataSource(ormConfig);
