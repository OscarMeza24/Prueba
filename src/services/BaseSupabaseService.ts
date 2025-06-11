import { createClient } from '@supabase/supabase-js';

export abstract class BaseSupabaseService {
    protected supabase;
    protected tableName: string;

    private initialized = false;

    constructor(tableName: string) {
        try {
            // Verificar que las variables de entorno están disponibles
            if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
                throw new Error('Faltan variables de entorno para Supabase');
            }

            // Crear cliente de Supabase con configuración de autenticación
            this.supabase = createClient(
                process.env.SUPABASE_URL!,
                process.env.SUPABASE_KEY!,
                {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: false,
                        detectSessionInUrl: false
                    }
                }
            );
            
            // Si todo está bien, continuar con la inicialización
            this.tableName = tableName;
            console.log(`BaseSupabaseService inicializado para tabla ${tableName}`);
        } catch (error) {
            console.error('Error al inicializar BaseSupabaseService:', error);
            throw error;
        }
    }

    /**
     * Verifica si el servicio está inicializado
     */
    public isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Inicializa el servicio de manera asíncrona
     */
    async initialize(): Promise<void> {
        try {
            console.log(`Inicializando ${this.tableName}...`);
            
            // Verificar conexión
            const { data, error } = await this.supabase.auth.getSession();
            if (error) {
                console.error('Error al verificar conexión:', error);
                throw error;
            }
            console.log('Conexión verificada exitosamente');
            
            // Verificar que la tabla existe
            const { data: tableData, error: tableError } = await this.supabase
                .from(this.tableName)
                .select('id')
                .limit(1);

            if (tableError) {
                console.error(`Error al verificar tabla ${this.tableName}:`, tableError);
                throw tableError;
            }

            this.initialized = true;
            console.log(`${this.tableName} inicializado correctamente`);
        } catch (error) {
            console.error(`Error al inicializar ${this.tableName}:`, error);
            throw error;
        }
    }

    async getAll() {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select('*');

        if (error) throw error;
        return data;
    }

    async getById(id: string) {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    async create(item: any) {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .insert([item])
            .select('*')
            .single();

        if (error) throw error;
        return data;
    }

    async update(id: string, item: any): Promise<any> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .update(item)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw new Error(`Error al actualizar ${this.tableName}: ${error.message}`);
            }

            return data;
        } catch (error) {
            console.error(`Error en update de ${this.tableName}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const { error } = await this.supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);

            if (error) {
                throw new Error(`Error al eliminar ${this.tableName}: ${error.message}`);
            }
        } catch (error) {
            console.error(`Error en delete de ${this.tableName}:`, error);
            throw error;
        }
    }
}
