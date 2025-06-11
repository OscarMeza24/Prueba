import { createClient, PostgrestError } from '@supabase/supabase-js';

export class SupabaseService {
    private readonly supabase: any;
    public readonly client: any;

    constructor() {
        console.log('Inicializando SupabaseService');
        console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
        console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY?.substring(0, 10) + '...');
        
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
            throw new Error('Faltan variables de entorno para Supabase');
        }

        try {
            this.supabase = createClient(
                process.env.SUPABASE_URL!,
                process.env.SUPABASE_KEY!,
                {
                    auth: {
                        autoRefreshToken: true,
                        persistSession: true,
                        detectSessionInUrl: false
                    }
                }
            );
            this.client = this.supabase;
            
            console.log('Supabase cliente inicializado');
        } catch (error) {
            console.error('Error al crear cliente Supabase:', error);
            throw new Error('No se pudo inicializar el cliente Supabase');
        }
    }

    async getProducts(): Promise<any[]> {
        try {
            const { data, error } = await this.client
                .from('productos')
                .select('*');
            
            if (error) {
                throw new Error(`Error al obtener productos: ${error.message}`);
            }
            return data || [];
        } catch (error) {
            console.error('Error en getProducts:', error);
            throw error;
        }
    }

    async getProductById(id: string): Promise<any | null> {
        try {
            const { data, error } = await this.client
                .from('productos')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error instanceof PostgrestError && error.code === 'PGRST116') {
                    return null;
                }
                throw new Error(`Error al obtener producto: ${error.message}`);
            }
            return data || null;
        } catch (error) {
            console.error('Error en getProductById:', error);
            throw error;
        }
    }

    async createProduct(product: any): Promise<any> {
        try {
            const { data, error } = await this.client
                .from('productos')
                .insert([product])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error al crear producto:', error);
            throw error;
        }
    }

    async updateProduct(id: number, product: any): Promise<any> {
        try {
            const { data, error } = await this.supabase
                .from('productos')
                .update(product)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    async deleteProduct(id: number): Promise<void> {
        try {
            const { error } = await this.supabase
                .from('productos')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }

    async getProductsAboutToExpire(): Promise<any[]> {
        try {
            const { data, error } = await this.supabase
                .from('productos')
                .select('*')
                .lt('fecha_vencimiento', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error al obtener productos por vencer:', error);
            throw error;
        }
    }

    async getProductsByCategory(categoriaId: number): Promise<any[]> {
        try {
            const { data, error } = await this.supabase
                .from('productos')
                .select('*')
                .eq('categoria_id', categoriaId);
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error al obtener productos por categoría:', error);
            throw error;
        }
    }
}