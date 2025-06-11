import { Router, Request, Response } from 'express';

export function createRoutes(productoController: any) {
    if (!productoController || !productoController.isInitialized()) {
        throw new Error('Controlador no inicializado correctamente');
    }

    const router = Router();

    const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => 
        async (req: Request, res: Response, next: (err?: any) => void) => {
            try {
                if (!fn) {
                    throw new Error('Controlador no inicializado');
                }
                await fn(req, res);
            } catch (error) {
                console.error('Error en ruta:', error);
                next(error);
            }
        };

    // Rutas CRUD básicas
    router.get('/', asyncHandler(productoController.getAll));
    router.get('/:id', asyncHandler(productoController.getById));
    router.post('/', asyncHandler(productoController.create));
    router.put('/:id', asyncHandler(productoController.update));
    router.delete('/:id', asyncHandler(productoController.delete));

    // Rutas específicas
    router.get('/por-vencer', asyncHandler(productoController.getPorVencer));
    router.get('/proveedor/:proveedorId', asyncHandler(productoController.getByProveedor));
    router.get('/categoria/:categoriaId', asyncHandler(productoController.getByCategoria));

    return router;
}