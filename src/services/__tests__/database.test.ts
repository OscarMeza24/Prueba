import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { testDataSource } from '../../config/test-db.config';
import { getRepository } from 'typeorm';

describe('Database Connection', () => {
    let connection: any;

    beforeAll(async () => {
        try {
            connection = await testDataSource.initialize();
        } catch (error) {
            console.error('Error initializing database:', error);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            if (connection && connection.isConnected) {
                await connection.destroy();
            }
        } catch (error) {
            console.error('Error destroying database connection:', error);
        }
    });

    it('should connect to the database successfully', async () => {
        expect(connection).toBeDefined();
        expect(connection.isConnected).toBe(true);
    });

    it('should create tables during initialization', async () => {
        // Verificar que las entidades se han inicializado correctamente
        const entities = connection.entityMetadatas;
        expect(entities).toBeDefined();
        expect(entities.length).toBeGreaterThan(0);
    });

    it('should be able to query the database', async () => {
        // Intentar hacer una consulta simple usando SQLite
        try {
            const result = await connection.query('SELECT 1 + 1 AS result');
            expect(result).toBeDefined();
            expect(result[0].result).toBe(2);
        } catch (error) {
            console.error('Error querying database:', error);
            expect(error).toBeUndefined();
        }
    });
});
