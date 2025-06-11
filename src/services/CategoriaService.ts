import { BaseSupabaseService } from './BaseSupabaseService';
import { PostgrestError } from '@supabase/supabase-js';

export class CategoriaService extends BaseSupabaseService {
    constructor() {
        super('categorias');
        console.log('CategoriaService - Iniciando');
        console.log('CategoriaService - URL:', process.env.SUPABASE_URL);
        console.log('CategoriaService - KEY:', process.env.SUPABASE_KEY ? 'Existe' : 'No existe');
    }

    public isInitialized(): boolean {
        return super.isInitialized();
    }

    async initialize(): Promise<void> {
        try {
            await super.initialize();
        } catch (error) {
            console.error('Error al inicializar CategoriaService:', error);
            throw error;
        }
    }

    async getAll(): Promise<any[]> {
        try {
            const { data, error } = await this.supabase
                .from('categorias')
                .select('*');

            if (error) {
                throw new Error(`Error al obtener categorías: ${error.message}`);
            }

            return data || [];
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    }

    async getById(id: string): Promise<any | null> {
        try {
            const { data, error } = await this.supabase
                .from('categorias')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error instanceof PostgrestError && error.code === 'PGRST116') {
                    return null;
                }
                throw new Error(`Error al obtener categoría: ${error.message}`);
            }

            return data || null;
        } catch (error) {
            console.error('Error en getById:', error);
            throw error;
        }
    }

    async create(data: any): Promise<any> {
        try {
            const { data: result, error } = await this.supabase
                .from('categorias')
                .insert([data])
                .select()
                .single();

            if (error) {
                throw new Error(`Error al crear categoría: ${error.message}`);
            }

            return result;
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    async update(id: string, data: any): Promise<any> {
        try {
            const { data: result, error } = await this.supabase
                .from('categorias')
                .update(data)
                .eq('id', id)
                .single();

            if (error) {
                throw new Error(`Error al actualizar categoría: ${error.message}`);
            }

            return result;
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const { error } = await this.supabase
                .from('categorias')
                .delete()
                .eq('id', id);

            if (error) {
                if (error instanceof PostgrestError && error.code === 'PGRST116') {
                    return;
                }
                throw new Error(`Error al eliminar categoría: ${error.message}`);
            }
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }
}