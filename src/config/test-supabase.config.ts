import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Faltan variables de entorno para Supabase. Por favor, configura SUPABASE_URL y SUPABASE_KEY en tu archivo .env');
}

export const testSupabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
        }
    }
);

// Funciones de utilidad para las pruebas
export const createTestTable = async (tableName: string) => {
    const { data, error } = await testSupabase
        .rpc('create_test_table', {
            table_name: tableName
        });
    
    if (error) {
        console.error('Error creating test table:', error);
        throw error;
    }
    
    if (!data || !data.status) {
        throw new Error('Invalid response from create_test_table RPC');
    }
    
    if (data.status !== 'success') {
        console.warn('Warning from create_test_table:', data.message);
    }
    
    return data;
};

export const dropTestTable = async (tableName: string) => {
    const { data, error } = await testSupabase
        .rpc('drop_test_table', {
            table_name: tableName
        });
    
    if (error) {
        console.error('Error dropping test table:', error);
        return null;
    }
    
    if (!data || !data.status) {
        console.error('Invalid response from drop_test_table RPC');
        return null;
    }
    
    if (data.status !== 'success') {
        console.warn('Warning from drop_test_table:', data.message);
    }
    
    return data;
};
