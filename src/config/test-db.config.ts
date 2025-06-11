import { DataSource } from 'typeorm';

export const testDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    entities: ['src/entities/**/*.ts'],
    logging: false
});
