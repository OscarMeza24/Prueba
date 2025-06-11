    import { Request, Response } from 'express';
import { ApiError } from '../middleware/errorHandler';
import { BaseController } from './BaseController';
import { ProductoService } from '../services/ProductoService';
import { validationResult } from 'express-validator';

interface ProductoRequest {
    nombre: string;
    codigo_barras?: string;
    categoria_id?: number;
    proveedor_id?: number;
    precio_unitario: number;
    fecha_caducidad: string;
    cantidad_stock: number;
    almacenamiento_id?: number;
    estado?: string;
    clasificacion_ia?: string;
}

export class ProductoController extends BaseController<ProductoService> {
    constructor() {
        super();
        // Vincular métodos para asegurar el contexto correcto
        this.getAll = this.getAll.bind(this);
        this.getByProveedor = this.getByProveedor.bind(this);
        this.getPorVencer = this.getPorVencer.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    /**
     * Inicializa el servicio del controlador
     */
    protected async initializeService(): Promise<void> {
        try {
            const service = new ProductoService();
            await service.initialize();
            this.setService(service);
        } catch (error) {
            console.error('Error al inicializar ProductoController:', error);
            throw new ApiError(500, 'Error al inicializar el servicio de productos');
        }
    }

    /**
     * Crea un nuevo producto
     */
    async create(req: Request<{}, {}, ProductoRequest>, res: Response): Promise<void> {
        await this.initialize();
        try {
            // Get the validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ApiError(400, 'Datos inválidos', errors.array());
            }

            // Map request body to database field names
            const producto: ProductoRequest = {
                nombre: req.body.nombre,
                codigo_barras: req.body.codigo_barras,
                categoria_id: req.body.categoria_id,
                proveedor_id: req.body.proveedor_id,
                precio_unitario: req.body.precio_unitario,
                fecha_caducidad: req.body.fecha_caducidad,
                cantidad_stock: req.body.cantidad_stock,
                almacenamiento_id: req.body.almacenamiento_id,
                estado: req.body.estado,
                clasificacion_ia: req.body.clasificacion_ia
            };

            // Remove undefined fields
            const keys: (keyof ProductoRequest)[] = ['nombre', 'codigo_barras', 'categoria_id', 'proveedor_id', 'precio_unitario', 'fecha_caducidad', 'cantidad_stock', 'almacenamiento_id', 'estado', 'clasificacion_ia'];
            keys.forEach((key) => {
                if (producto[key] === undefined) {
                    delete producto[key];
                }
            });

            try {
                const result = await this.service!.createProduct(producto);
                res.status(201).json(result);
            } catch (error) {
                if (error instanceof Error && error.message.includes('duplicate key value violates unique constraint')) {
                    throw new ApiError(400, 'El código de barras ya está en uso', error);
                }
                throw error;
            }
        } catch (error) {
            console.error('Error al crear producto:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error al crear producto');
        }
    }

    /**
     * Actualiza un producto existente
     */
    async update(req: Request<{ id: string }>, res: Response): Promise<void> {
        await this.initialize();
        try {
            const id = parseInt(req.params.id);
            const producto = req.body;
            const result = await this.service!.updateProduct(id, producto);
            res.json(result);
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw new ApiError(500, 'Error al actualizar producto');
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        await this.initialize();
        try {
            const productos = await this.service!.getAll();
            res.json(productos);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw new ApiError(500, 'Error al obtener productos');
        }
    }

    async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
        await this.initialize();
        try {
            const id = req.params.id;
            const producto = await this.service!.getById(id);
            if (!producto) {
                throw new ApiError(404, 'Producto no encontrado');
            }
            res.json(producto);
        } catch (error) {
            console.error('Error al obtener producto:', error);
            throw new ApiError(500, 'Error al obtener producto');
        }
    }

    async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
        await this.initialize();
        try {
            const id = req.params.id;
            await this.service!.delete(id);
            res.status(204).end();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw new ApiError(500, 'Error al eliminar producto');
        }
    }

    async getPorVencer(req: Request, res: Response): Promise<void> {
        try {
            if (!this.service) {
                throw new ApiError(500, 'ProductoService no está disponible');
            }
            const productos = await this.service.getProductsAboutToExpire();
            res.json(productos);
        } catch (error: unknown) {
            console.error('Error al obtener productos por vencer:', error);
            if (error instanceof Error) {
                throw new ApiError(500, error.message, { error });
            }
            throw new ApiError(500, 'Error desconocido', { error });
        }
    }

    async getByProveedor(req: Request<{ proveedorId: string }>, res: Response): Promise<void> {
        await this.initialize();
        try {
            const proveedorId = parseInt(req.params.proveedorId);
            const productos = await this.service!.getProductsByProvider(proveedorId);
            res.json(productos);
        } catch (error) {
            console.error('Error al obtener productos por proveedor:', error);
            throw new ApiError(500, 'Error al obtener productos por proveedor');
        }
    }

    async getByCategoria(req: Request<{ categoriaId: string }>, res: Response): Promise<void> {
        await this.initialize();
        try {
            const categoriaId = parseInt(req.params.categoriaId);
            const productos = await this.service!.getProductsByCategory(categoriaId);
            res.json(productos);
        } catch (error) {
            console.error('Error al obtener productos por categoría:', error);
            throw new ApiError(500, 'Error al obtener productos por categoría');
        }
    }
}