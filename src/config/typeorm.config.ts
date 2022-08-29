import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: "postgres",
    password:"postgres1",
    database: 'taskmanagement',
    entities: [__dirname + '/../**/*.entity{.js, .ts}'],
    autoLoadEntities: true,
    synchronize: true,
}