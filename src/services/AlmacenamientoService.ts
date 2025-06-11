// src/services/AlmacenamientoService.ts
import { BaseSupabaseService } from './BaseSupabaseService';

export class AlmacenamientoService extends BaseSupabaseService {
    constructor() {
        super('almacenamientos');
    }

    async initialize(): Promise<void> {
        try {
            // Verificar conexión con Supabase
            const { data, error } = await this.supabase.auth.getSession();
            if (error) {
                throw new Error('No se pudo conectar con Supabase: ' + error.message);
            }
            
            // Verificar que la tabla existe
            const { data: tableData, error: tableError } = await this.supabase
                .from('almacenamientos')
                .select('id')
                .limit(1);

            if (tableError) {
                throw new Error('No se pudo acceder a la tabla almacenamientos: ' + tableError.message);
            }

            console.log('AlmacenamientoService inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar AlmacenamientoService:', error);
            throw error;
        }
    }

    async getAll(): Promise<any[]> {
        const { data, error } = await this.supabase
            .from('almacenamientos')
            .select('*');

        if (error) throw error;
        return data || [];
    }

    async getById(id: string): Promise<any> {
        const { data, error } = await this.supabase
            .from('almacenamientos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    async create(almacenamiento: any): Promise<any> {
        try {
            // Eliminar el campo estado si existe
            const almacenamientoData = { ...almacenamiento };
            if ('estado' in almacenamientoData) {
                delete almacenamientoData.estado;
            }
            
            const { data, error } = await this.supabase
                .from('almacenamientos')
                .insert([almacenamientoData])
                .select('*')
                .single();

            if (error) {
                console.error('Error en create:', error);
                throw new Error(`Error al crear almacenamiento: ${error.message} - Details: ${error.details}`);
            }
            return data;
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    async update(id: string, almacenamiento: any): Promise<any> {
        try {
            // Preparar los datos para la actualización
            const updateData = { ...almacenamiento };
            
            // Eliminar campos que no existen en la base de datos
            if ('estado' in updateData) {
                delete updateData.estado;
            }

            const { data, error } = await this.supabase
                .from('almacenamientos')
                .update(updateData)
                .eq('id', id)
                .select('*')
                .single();

            if (error) {
                console.error('Error en update:', error);
                throw error;
            }
            return data;
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('almacenamientos')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    async getWithProductos(id?: number): Promise<any[]> {
        const { data, error } = await this.supabase
            .from('almacenamientos')
            .select('*, productos!inner(*)')
            .eq('id', id || undefined);

        if (error) throw error;
        return data || [];
    }
}