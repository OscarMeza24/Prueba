import { Request, Response } from 'express';
import { CategoriaService } from '../services/CategoriaService';
import { BaseController } from './BaseController';
import { ApiError } from '../utils/ApiError';

export class CategoriaController extends BaseController<CategoriaService> {
    constructor() {
        super();
        
        // Bind methods to maintain context
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    protected async initializeService(): Promise<void> {
        const service = new CategoriaService();
        await service.initialize();
        this.setService(service);
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            if (!this.service) {
                throw new ApiError(500, 'Servicio no inicializado');
            }
            
            if (!this.service.isInitialized()) {
                throw new ApiError(500, 'Servicio no está inicializado');
            }
            
            const categorias = await this.service.getAll();
            if (!categorias || categorias.length === 0) {
                throw new ApiError(404, 'No se encontraron categorías');
            }
            
            res.json(categorias);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            throw new ApiError(500, 'Error al obtener categorías');
        }
    }

    async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
        if (!this.service) {
            throw new ApiError(500, 'Servicio no inicializado');
        }
        try {
            const id = req.params.id;
            if (!id) {
                throw new ApiError(400, 'ID inválido');
            }
            const categoria = await this.service.getById(id);
            if (!categoria) {
                throw new ApiError(404, 'Categoría no encontrada');
            }
            res.json(categoria);
        } catch (error) {
            console.error('Error en getById:', error);
            throw new ApiError(500, 'Error al obtener categoría');
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            console.log('Creando nueva categoría:', req.body);
            if (!this.service) {
                throw new ApiError(500, 'Servicio no inicializado');
            }
            const categoria = await this.service.create(req.body);
            console.log('Categoría creada:', categoria);
            res.status(201).json(categoria);
        } catch (error) {
            console.error('Error al crear categoría:', error);
            throw new ApiError(500, 'Error al crear categoría');
        }
    }

    async update(req: Request<{ id: string }>, res: Response): Promise<void> {
        await this.initialize();
        try {
            const id = req.params.id;
            const categoria = await this.service!.update(id, req.body);
            if (!categoria) {
                throw new ApiError(404, 'Categoría no encontrada');
            }
            res.json(categoria);
        } catch (error) {
            console.error('Error en update:', error);
            throw new ApiError(500, 'Error al actualizar categoría');
        }
    }

    async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
        await this.initialize();
        try {
            const id = req.params.id;
            await this.service!.delete(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error en delete:', error);
            throw new ApiError(500, 'Error al eliminar categoría');
        }
    }
}