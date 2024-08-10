"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const dotenv_1 = require("dotenv");
const typeorm_1 = require("typeorm");
(0, dotenv_1.config)();
let ormConfig;
if (process.env.BACKEND_ENV === 'dev') {
    ormConfig = {
        name: 'dev',
        type: 'postgres',
        host: (_a = process.env.DB_HOST) !== null && _a !== void 0 ? _a : 'localhost',
        port: 5434,
        username: (_b = process.env.DB_USER) !== null && _b !== void 0 ? _b : 'postgres',
        password: (_c = process.env.DB_PASS) !== null && _c !== void 0 ? _c : 'laravel88',
        database: (_d = process.env.DB_NAME) !== null && _d !== void 0 ? _d : 'kyc',
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
}
else if (process.env.ENV === 'test') {
    ormConfig = {
        name: 'default',
        type: 'postgres',
        host: (_e = process.env.TEST_DATABASE_HOST) !== null && _e !== void 0 ? _e : 'localhost',
        port: 5434,
        username: (_f = process.env.DB_USER) !== null && _f !== void 0 ? _f : 'postgres',
        password: (_g = process.env.TEST_DATABASE_PASSWORD) !== null && _g !== void 0 ? _g : 'laravel88',
        database: (_h = process.env.TEST_DB_NAME) !== null && _h !== void 0 ? _h : 'app-test',
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
}
else {
    ormConfig = {
        name: 'default',
        type: 'postgres',
        host: (_j = process.env.DB_HOST) !== null && _j !== void 0 ? _j : 'localhost',
        port: 5434,
        username: (_k = process.env.DB_USER) !== null && _k !== void 0 ? _k : 'postgres',
        password: (_l = process.env.DB_PASS) !== null && _l !== void 0 ? _l : 'laravel88',
        database: (_m = process.env.DB_NAME) !== null && _m !== void 0 ? _m : 'kyc',
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
exports.dataSource = new typeorm_1.DataSource(ormConfig);
//# sourceMappingURL=data-source.js.map