import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { testSupabase, createTestTable, dropTestTable } from '../../config/test-supabase.config';
import logger from '@/utils/logger';

describe('Supabase Integration', () => {
    let supabase: any;

    beforeAll(async () => {
        supabase = testSupabase;
        logger.info('Starting Supabase tests');
        
        // Crear una tabla temporal para las pruebas
        const createResult = await createTestTable('test_products');
        logger.info('Test table creation result:', createResult);
    });

    afterAll(async () => {
        logger.info('Cleaning up after Supabase tests');
        // Eliminar la tabla temporal después de las pruebas
        const dropResult = await dropTestTable('test_products');
        logger.info('Test table drop result:', dropResult);
    });

    it('should connect to Supabase successfully', async () => {
        const { data, error } = await supabase.auth.getSession();
        expect(error).toBeNull();
        expect(data).toBeDefined();
    });

    it('should insert and retrieve a product', async () => {
        // Insertar un producto de prueba
        const insert = await supabase
            .from('test_products')
            .insert({
                name: 'Test Product',
                description: 'A test product for integration testing',
                price: 99.99,
                stock: 10
            })
            .select();

        expect(insert.error).toBeNull();
        expect(insert.data).toBeDefined();
        expect(insert.data.length).toBe(1);

        const insertedProduct = insert.data[0];

        // Recuperar el producto
        const { data: retrievedData, error: retrieveError } = await supabase
            .from('test_products')
            .select()
            .eq('id', insertedProduct.id);

        expect(retrieveError).toBeNull();
        expect(retrievedData).toBeDefined();
        expect(retrievedData.length).toBe(1);
        expect(retrievedData[0]).toEqual(insertedProduct);
    });

    it('should update a product', async () => {
        // Insertar un producto para actualizar
        const insert = await supabase
            .from('test_products')
            .insert({
                name: 'Product to Update',
                description: 'Initial description',
                price: 100.00,
                stock: 5
            })
            .select();

        expect(insert.error).toBeNull();
        expect(insert.data).toBeDefined();
        expect(insert.data.length).toBe(1);

        const product = insert.data[0];

        // Actualizar el producto
        const update = await supabase
            .from('test_products')
            .update({
                description: 'Updated description',
                price: 150.00,
                stock: 10
            })
            .eq('id', product.id)
            .select();

        expect(update.error).toBeNull();
        expect(update.data).toBeDefined();
        expect(update.data.length).toBe(1);
        expect(update.data[0].description).toBe('Updated description');
        expect(update.data[0].price).toBe(150.00);
        expect(update.data[0].stock).toBe(10);
    });

    it('should delete a product', async () => {
        // Insertar un producto para eliminar
        const insert = await supabase
            .from('test_products')
            .insert({
                name: 'Product to Delete',
                description: 'This will be deleted',
                price: 200.00,
                stock: 15
            })
            .select();

        expect(insert.error).toBeNull();
        expect(insert.data).toBeDefined();
        expect(insert.data.length).toBe(1);

        const product = insert.data[0];

        // Eliminar el producto
        const deleteResult = await supabase
            .from('test_products')
            .delete()
            .eq('id', product.id)
            .select();

        expect(deleteResult.error).toBeNull();
        expect(deleteResult.data).toBeDefined();

        // Verificar que el producto fue eliminado
        const { data: remainingData } = await supabase
            .from('test_products')
            .select()
            .eq('id', product.id);

        expect(remainingData.length).toBe(0);
    });
});
