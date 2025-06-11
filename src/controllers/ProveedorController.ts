import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ProveedorService } from '../services/ProveedorService';
import { ApiError } from '../middleware/errorHandler';

export class ProveedorController extends BaseController<ProveedorService> {
    constructor() {
        super();
        console.log('ProveedorController creado');
        
        // Vincular métodos para asegurar el contexto correcto
        this.initializeService = this.initializeService.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    protected async initializeService(): Promise<void> {
        console.log('ProveedorController.initializeService - Inicializando servicio...');
        try {
            const service = new ProveedorService();
            await service.initialize();
            this.setService(service);
            console.log('ProveedorController.initializeService - Servicio inicializado');
        } catch (error) {
            console.error('ProveedorController.initializeService - Error al inicializar servicio:', error);
            throw new ApiError(500, 'Error al inicializar el servicio de proveedores');
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            console.log('ProveedorController.getAll - Iniciando');
            
            // Verificar que el controlador está inicializado
            if (!this.isInitialized()) {
                console.error('ProveedorController.getAll - Controlador no inicializado');
                throw new ApiError(500, 'Controlador no inicializado');
            }

            console.log('ProveedorController.getAll - Controlador inicializado');
            
            console.log('ProveedorController.getAll - Obteniendo proveedores...');
            const proveedores = await this.service!.getAll();
            console.log('ProveedorController.getAll - Proveedores obtenidos:', proveedores);
            res.json(proveedores);
        } catch (error: unknown) {
            console.error('ProveedorController.getAll - Error:', error);
            if (error instanceof Error) {
                console.error('ProveedorController.getAll - Error message:', error.message);
            }
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                details: error instanceof Error ? error.stack : undefined
            });
        }
    }

    async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
        try {
            console.log('ProveedorController.getById - Iniciando');
            await this.initialize();
            
            const id = parseInt(req.params.id);
            const proveedor = await this.service!.getWithProducts(id);
            if (!proveedor) {
                throw new ApiError(404, 'Proveedor no encontrado');
            }
            res.json(proveedor);
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const proveedor = await this.service!.create(req.body);
            res.status(201).json(proveedor);
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }

    async update(req: Request<{ id: string }>, res: Response): Promise<void> {
        await this.initialize();
        try {
            const id = req.params.id;
            const proveedor = await this.service!.update(id, req.body);
            if (!proveedor) {
                throw new ApiError(404, 'Proveedor no encontrado');
            }
            res.json(proveedor);
        } catch (error) {
            console.error('Error en update:', error);
            throw new ApiError(500, 'Error al actualizar proveedor');
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
            throw new ApiError(500, 'Error al eliminar proveedor');
        }
    }
}