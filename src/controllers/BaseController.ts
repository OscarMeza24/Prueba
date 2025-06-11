// src/controllers/BaseController.ts
import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { validate } from 'class-validator';
import { ApiError } from '../middleware/errorHandler';
import { BaseSupabaseService } from '../services/BaseSupabaseService';

export abstract class BaseController<TService extends BaseSupabaseService, TParams = {}, TBody = {}> {
    protected service: TService | null = null;
    protected supabase: any;
    private initialized = false;

    constructor() {
        // Inicializar cliente Supabase
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
    }

    public setService(service: TService): void {
        if (this.service) {
            throw new Error('El servicio ya está asignado');
        }
        this.service = service;
        this.initialized = true;
    }

    protected abstract initializeService(): Promise<void>;

    public async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            await this.initializeService();
            if (!this.service) {
                throw new Error('El servicio no está disponible después de initializeService');
            }
            
            await this.service.initialize();
            this.initialized = true;
            console.log(`${this.constructor.name} inicializado correctamente`);
        } catch (error) {
            console.error(`${this.constructor.name} - Error al inicializar:`, error);
            throw new ApiError(500, `Error al inicializar ${this.constructor.name}`);
        }
    }

    /**
     * Verifica si el controlador está inicializado
     */
    public isInitialized(): boolean {
        return this.initialized && this.service !== null;
    }

    /**
     * Verifica si el servicio está disponible
     */
    public hasService(): boolean {
        return this.service !== null;
    }

    protected async validate<T extends object>(data: T): Promise<void> {
        const errors = await validate(data);
        if (errors.length > 0) {
            throw new ApiError(400, 'Datos inválidos', errors);
        }
    }

    protected throwNotFoundError(message: string = 'Recurso no encontrado'): never {
        throw new ApiError(404, message);
    }

    protected throwBadRequest(message: string): never {
        throw new ApiError(400, message);
    }

    async getAll(req: Request, res: Response): Promise<void> {
        if (!this.service) {
            throw new ApiError(500, 'Servicio no inicializado');
        }
        try {
            const items = await this.service.getAll();
            res.json(items);
        } catch (error: unknown) {
            console.error('BaseController.getAll - Error:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                details: error instanceof Error ? error.stack : undefined
            });
        }
    }

    async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
        if (!this.service) {
            throw new ApiError(500, 'Servicio no inicializado');
        }
        try {
            const id = req.params.id;
            const item = await this.service!.getById(id);
            if (!item) {
                throw new ApiError(404, 'Recurso no encontrado');
            }
            res.json(item);
        } catch (error: unknown) {
            console.error('BaseController.getById - Error:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                details: error instanceof Error ? error.stack : undefined
            });
        }
    }

    async create(req: Request<{}, {}, TBody>, res: Response): Promise<void> {
        if (!this.service) {
            throw new ApiError(500, 'Servicio no inicializado');
        }
        try {
            const item = await this.service.create(req.body);
            res.status(201).json(item);
        } catch (error: unknown) {
            console.error('BaseController.create - Error:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                details: error instanceof Error ? error.stack : undefined
            });
        }
    }

    async update(req: Request<{ id: string }>, res: Response): Promise<void> {
        await this.initialize();
        try {
            const id = req.params.id;
            const item = await this.service!.update(id, req.body);
            res.json(item);
        } catch (error) {
            console.error('Error al actualizar:', error);
            throw new ApiError(500, 'Error al actualizar');
        }
    }

    async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
        await this.initialize();
        try {
            const id = req.params.id;
            await this.service!.delete(id);
            res.status(204).end();
        } catch (error) {
            console.error('Error al eliminar:', error);
            throw new ApiError(500, 'Error al eliminar');
        }
    }
}