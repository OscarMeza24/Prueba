import { BaseSupabaseService } from './BaseSupabaseService';

export class ProveedorService extends BaseSupabaseService {
    constructor() {
        super('proveedores');
        console.log('Constructor ProveedorService - Iniciando');
        console.log('Constructor ProveedorService - URL:', process.env.SUPABASE_URL);
        console.log('Constructor ProveedorService - KEY:', process.env.SUPABASE_KEY ? 'Existe' : 'No existe');
        console.log('Constructor ProveedorService - Tabla:', this.tableName);
    }

    async getAll(): Promise<any[]> {
        try {
            // Verificar que el servicio está inicializado
            if (!this.isInitialized()) {
                console.error('ProveedorService.getAll - Servicio no inicializado');
                throw new Error('Servicio no inicializado');
            }

            console.log('ProveedorService.getAll - Obteniendo proveedores...');
            const { data: proveedores, error: error } = await this.supabase
                .from('proveedores')
                .select('*');

            if (error) {
                console.error('ProveedorService.getAll - Error al obtener proveedores:', error);
                throw error;
            }

            console.log('ProveedorService.getAll - Proveedores obtenidos:', proveedores);
            return proveedores || [];
        } catch (error) {
            console.error('ProveedorService.getAll - Error:', error);
            throw error;
        }
    }

    async getById(id: string): Promise<any | null> {
        const { data: proveedor, error: error } = await this.supabase
            .from('proveedores')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return proveedor || null;
    }

    async create(data: any): Promise<any> {
        const { data: proveedor, error: error } = await this.supabase
            .from('proveedores')
            .insert([data])
            .select('*')
            .single();

        if (error) throw error;
        return proveedor;
    }

    async update(id: string, data: any): Promise<any | null> {
        const { data: proveedor, error: error } = await this.supabase
            .from('proveedores')
            .update(data)
            .eq('id', id)
            .select('*')
            .single();

        if (error) throw error;
        return proveedor || null;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('proveedores')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    async getWithProducts(id?: number): Promise<any[]> {
        const { data: proveedores, error: proveedoresError } = await this.supabase
            .from('proveedores')
            .select('*, productos!inner(*)')
            .eq('id', id || undefined);

        if (proveedoresError) throw proveedoresError;
        return proveedores || [];
    }
}