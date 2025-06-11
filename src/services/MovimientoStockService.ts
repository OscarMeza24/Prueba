import { BaseSupabaseService } from './BaseSupabaseService';

export class MovimientoStockService extends BaseSupabaseService {
    constructor() {
        super('movimientos_stock');
    }

    async getAll(): Promise<any[]> {
        const { data, error } = await this.supabase
            .from('movimientos_stock')
            .select('*');

        if (error) throw error;
        return data || [];
    }

    async getById(id: string): Promise<any> {
        const { data, error } = await this.supabase
            .from('movimientos_stock')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    async create(movimiento: any): Promise<any> {
        const { data, error } = await this.supabase
            .from('movimientos_stock')
            .insert([movimiento])
            .select('*')
            .single();

        if (error) throw error;
        return data;
    }

    async update(id: string, movimiento: any): Promise<any> {
        const { data, error } = await this.supabase
            .from('movimientos_stock')
            .update(movimiento)
            .eq('id', id)
            .select('*')
            .single();

        if (error) throw error;
        return data;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('movimientos_stock')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    async getByProducto(productoId: number): Promise<any[]> {
        const { data, error } = await this.supabase
            .from('movimientos_stock')
            .select('*')
            .eq('producto_id', productoId);

        if (error) throw error;
        return data || [];
    }

    async getProductById(id: number): Promise<any> {
        const { data, error } = await this.supabase
            .from('productos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    async updateStock(id: number, cantidad: number): Promise<void> {
        const { error } = await this.supabase
            .from('productos')
            .update({ cantidad_stock: cantidad })
            .eq('id', id);

        if (error) throw error;
    }
}