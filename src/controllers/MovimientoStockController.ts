import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { MovimientoStockService } from '../services/MovimientoStockService';
import { BaseController } from './BaseController';
import { ApiError } from '../middleware/errorHandler';

export interface MovimientoStockParams extends ParamsDictionary {
    id: string;
    producto_id: string;
}

interface MovimientoStockBody {
    producto_id: number;
    cantidad: number;
    tipo_movimiento: string;
    descripcion: string;
}

export class MovimientoStockController extends BaseController<MovimientoStockService> {
    constructor() {
        super();
        console.log('MovimientoStockController creado');
        
        // Vincular métodos para asegurar el contexto correcto
        this.initializeService = this.initializeService.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    protected async initializeService(): Promise<void> {
        console.log('MovimientoStockController.initializeService - Inicializando servicio...');
        try {
            const service = new MovimientoStockService();
            await service.initialize();
            this.setService(service);
            console.log('MovimientoStockController.initializeService - Servicio inicializado');
        } catch (error) {
            console.error('MovimientoStockController.initializeService - Error al inicializar servicio:', error);
            throw new ApiError(500, 'Error al inicializar el servicio de movimientos de stock');
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            // Verificar inicialización
            await this.initialize();
            
            if (!this.service) {
                throw new Error('Servicio no inicializado');
            }
            
            const movimientos = await this.service.getAll();
            res.json(movimientos);
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }

    async getById(req: Request<ParamsDictionary & { id: string }>, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            if (!this.service) {
                throw new Error('Servicio no inicializado');
            }
            const movimiento = await this.service.getById(id);
            if (!movimiento) {
                res.status(404).json({ error: 'Movimiento no encontrado' });
                return;
            }
            res.json(movimiento);
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }

    async getByProducto(req: Request<MovimientoStockParams>, res: Response): Promise<void> {
        try {
            const productoId = Number(req.params.producto_id);
            const movimientos = await this. service!.getByProducto(productoId);
            res.json(movimientos);
        } catch (error: unknown) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }

    async create(req: Request<{}, {}, MovimientoStockBody>, res: Response): Promise<void> {
        try {
            console.log('Datos recibidos:', req.body);
            const { producto_id, cantidad, tipo_movimiento, descripcion } = req.body;

            // Verificar si el producto existe
            console.log('Buscando producto con ID:', producto_id);
            if (!this.service) {
                throw new Error('Servicio no inicializado');
            }
            const producto = await this.service.getProductById(producto_id);
            console.log('Producto encontrado:', producto);
            
            if (!producto) {
                res.status(404).json({ error: 'Producto no encontrado' });
                return;
            }

            // Verificar stock disponible para salidas
            if (tipo_movimiento === 'salida' && producto.cantidad < cantidad) {
                res.status(400).json({ 
                    error: 'No hay suficiente stock para realizar la salida' 
                });
                return;
            }

            // Crear el movimiento con fecha actual
            console.log('Creando movimiento con datos:', {
                producto_id,
                cantidad,
                tipo_movimiento,
                motivo: descripcion,
                fecha_movimiento: new Date().toISOString()
            });
            
            const movimiento = await this.service.create({
                producto_id,
                cantidad,
                tipo_movimiento,
                motivo: descripcion,
                fecha_movimiento: new Date().toISOString()
            });
            console.log('Movimiento creado:', movimiento);

            // Actualizar el stock del producto
            const nuevaCantidadStock = tipo_movimiento === 'entrada' 
                ? producto.cantidad_stock + cantidad 
                : producto.cantidad_stock - cantidad;
            
            console.log('Actualizando stock a:', nuevaCantidadStock);
            if (!this.service) {
                throw new Error('Servicio no inicializado');
            }
            await this.service.updateStock(producto_id, nuevaCantidadStock);

            res.status(201).json(movimiento);
        } catch (error: unknown) {
            console.error('Error en create:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                details: error instanceof Error ? error.stack : undefined
            });
        }
    }
}
