import { BaseSupabaseService } from './BaseSupabaseService';

export class ProductoService extends BaseSupabaseService {
    constructor() {
        console.log('Constructor ProductoService - Iniciando');
        console.log('Constructor ProductoService - URL:', process.env.SUPABASE_URL);
        console.log('Constructor ProductoService - KEY:', process.env.SUPABASE_KEY ? 'Existe' : 'No existe');
        console.log('Constructor ProductoService - Tabla:', 'productos');
        super('productos');
        console.log('Constructor ProductoService - BaseSupabaseService inicializado');
        

    }

    /**
     * Verifica si el servicio está inicializado
     */
    public isInitialized(): boolean {
        return super.isInitialized();
    }

    /**
     * Inicializa el servicio de manera asíncrona
     */
    async initialize(): Promise<void> {
        try {
            console.log('ProductoService - Iniciando inicialización');
            await super.initialize();
            console.log('ProductoService - BaseSupabaseService inicializado');
            
            // Verificar conexión
            const session = await this.supabase.auth.getSession();
            if (session.error) {
                console.error('Error al verificar conexión:', session.error);
                throw session.error;
            }
            console.log('ProductoService - Conexión con Supabase verificada');
            
            // Verificar que la tabla existe
            const { data, error } = await this.supabase
                .from('productos')
                .select('id')
                .limit(1);

            if (error) {
                console.error('Error al verificar tabla productos:', error);
                throw error;
            }

            console.log('ProductoService inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar ProductoService:', error);
            throw error;
        }
    }

    /**
     * Verifica la conexión con Supabase
     */


    private async queryProducts(filter: any, order?: any): Promise<any[]> {
        try {
            let query = this.supabase
                .from(this.tableName)
                .select('*');

            if (filter) {
                Object.entries(filter).forEach(([key, value]) => {
                    if (value !== undefined) {
                        query = query.eq(key, value);
                    }
                });
            }

            if (order) {
                query = query.order(order.field, { ascending: order.ascending });
            }

            const { data, error } = await query;
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error al consultar productos:', error);
            throw error;
        }
    }

    async getProductsByProvider(proveedorId: number): Promise<any[]> {
        return this.queryProducts({ proveedor_id: proveedorId });
    }

    async getProductsByStorage(almacenamientoId: number): Promise<any[]> {
        return this.queryProducts({ almacenamiento_id: almacenamientoId });
    }

    async getProductsAboutToExpire(): Promise<any[]> {
        return this.queryProducts({
            fecha_vencimiento: {
                lt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
        }, { field: 'fecha_vencimiento', ascending: true });
    }

    async getProductById(id: number): Promise<any | null> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data || null;
        } catch (error) {
            console.error('Error al obtener producto:', error);
            throw error;
        }
    }

    async createProduct(product: any): Promise<any> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
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
                .from(this.tableName)
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
                .from(this.tableName)
                .delete()
                .eq('id', id);
            
            if (error) throw error;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }



    async getProductsByCategory(categoriaId: number): Promise<any[]> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
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
