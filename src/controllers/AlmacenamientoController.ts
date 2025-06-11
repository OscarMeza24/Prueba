// src/controllers/AlmacenamientoController.ts
import { Request, Response } from 'express';
import { AlmacenamientoService } from '../services/AlmacenamientoService';
import { BaseController } from './BaseController';
import { ApiError } from '../utils/ApiError';

interface AlmacenamientoParams {
    id: string;
}

interface AlmacenamientoBody {
    nombre: string;
    capacidad_maxima: number;
    ubicacion: string;
    estado?: string;  // Campo opcional
}

// Tipos para los métodos CRUD
interface AlmacenamientoResponse {
    id: string;
    nombre: string;
    capacidad_maxima: number;
    ubicacion: string;
    created_at: string;
    updated_at: string;
}

export class AlmacenamientoController extends BaseController<AlmacenamientoService> {
    constructor() {
        super();
        console.log('AlmacenamientoController creado');
        
        // Bind methods to maintain context
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    protected async initializeService(): Promise<void> {
        try {
            const service = new AlmacenamientoService();
            await service.initialize();
            this.setService(service);
        } catch (error) {
            console.error('Error al inicializar AlmacenamientoController:', error);
            throw new ApiError(500, 'Error al inicializar el servicio de almacenamiento');
        }
    }

    // Verificar que el servicio esté inicializado antes de usarlo
    private async ensureServiceInitialized(): Promise<void> {
        if (!this.isInitialized()) {
            throw new ApiError(500, 'El servicio no está inicializado');
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        await this.ensureServiceInitialized();
        try {
            const almacenamientos = await this.service!.getAll();
            res.json(almacenamientos as AlmacenamientoResponse[]);
        } catch (error) {
            console.error('Error en getAll:', error);
            throw new ApiError(500, 'Error al obtener almacenamientos');
        }
    }

    async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
        await this.ensureServiceInitialized();
        try {
            const id = req.params.id;
            const almacenamiento = await this.service!.getById(id);
            if (!almacenamiento) {
                throw new ApiError(404, 'Almacenamiento no encontrado');
            }
            res.json(almacenamiento as AlmacenamientoResponse);
        } catch (error) {
            console.error('Error en getById:', error);
            throw new ApiError(500, 'Error al obtener almacenamiento');
        }
    }

    async create(req: Request<{}, {}, AlmacenamientoBody>, res: Response): Promise<void> {
        await this.ensureServiceInitialized();
        try {
            // Validar que todos los campos requeridos estén presentes
            const { nombre, capacidad_maxima, ubicacion } = req.body;
            if (!nombre || !capacidad_maxima || !ubicacion) {
                throw new ApiError(400, 'Faltan campos requeridos: nombre, capacidad_maxima y ubicacion son obligatorios');
            }

            // Validar que la capacidad_maxima sea un número válido
            if (typeof capacidad_maxima !== 'number' || capacidad_maxima <= 0) {
                throw new ApiError(400, 'La capacidad_maxima debe ser un número mayor a 0');
            }

            const almacenamientoData = {
                nombre,
                capacidad_maxima,
                ubicacion
            };

            const almacenamiento = await this.service!.create(almacenamientoData);
            res.status(201).json(almacenamiento as AlmacenamientoResponse);
        } catch (error) {
            console.error('Error en create:', error);
            if (error instanceof Error) {
                if (error.message.includes('duplicate key value violates unique constraint')) {
                    throw new ApiError(400, 'El nombre del almacenamiento ya existe', error);
                }
                if (error.message.includes('violates check constraint')) {
                    throw new ApiError(400, 'Error en los datos proporcionados', error);
                }
            }
            throw new ApiError(500, 'Error al crear almacenamiento', error);
        }
    }

    async update(req: Request<{ id: string }, {}, AlmacenamientoBody>, res: Response): Promise<void> {
        await this.ensureServiceInitialized();
        try {
            const id = req.params.id;
            const almacenamiento = await this.service!.getById(id);
            if (!almacenamiento) {
                throw new ApiError(404, 'Almacenamiento no encontrado');
            }

            // Preparar los datos para la actualización
            const updateData: Partial<AlmacenamientoBody> = {};
            
            if (req.body.nombre !== undefined) {
                updateData.nombre = req.body.nombre;
            }
            if (req.body.capacidad_maxima !== undefined) {
                updateData.capacidad_maxima = req.body.capacidad_maxima;
            }
            if (req.body.ubicacion !== undefined) {
                updateData.ubicacion = req.body.ubicacion;
            }
            // No incluir el campo estado si no existe en la base de datos

            const updated = await this.service!.update(id, updateData);
            res.json(updated as AlmacenamientoResponse);
        } catch (error) {
            console.error('Error en update:', error);
            if (error instanceof Error && error.message.includes('duplicate key value violates unique constraint')) {
                throw new ApiError(400, 'El nombre del almacenamiento ya existe', error);
            }
            throw new ApiError(500, 'Error al actualizar almacenamiento', error);
        }
    }

    async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
        await this.ensureServiceInitialized();
        try {
            const id = req.params.id;
            await this.service!.delete(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error en delete:', error);
            throw new ApiError(500, 'Error al eliminar almacenamiento');
        }
    }
}