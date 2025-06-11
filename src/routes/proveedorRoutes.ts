import { Router, Request, Response } from 'express';
import { ProveedorController } from '../controllers/ProveedorController';

export function createRoutes(controller: any) {
    const router = Router();

    // Helper function to wrap async controller methods
    const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => 
        async (req: Request, res: Response, next: (err?: any) => void) => {
            try {
                // Verificar que el controlador está inicializado
                if (!controller.service) {
                    throw new Error('Controlador no inicializado');
                }
                
                await fn(req, res);
            } catch (error) {
                next(error);
            }
        };

    // Rutas CRUD básicas
    router.get('/', asyncHandler(controller.getAll));
    router.get('/:id', asyncHandler(controller.getById));
    router.post('/', asyncHandler(controller.create));
    router.put('/:id', asyncHandler(controller.update));
    router.delete('/:id', asyncHandler(controller.delete));

    // Ruta específica para obtener productos por proveedor
    router.get('/:id/productos', asyncHandler(controller.getProductosPorProveedor));

    return router;
}
