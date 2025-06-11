import { Router, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { MovimientoStockController, MovimientoStockParams } from '../controllers/MovimientoStockController';

type MovimientoStockByIdParams = { id: string } & ParamsDictionary;

export function createRoutes(controller: any) {
    const router = Router();

    // Helper function to wrap async controller methods
    const asyncHandler = (fn: (req: Request<MovimientoStockParams>, res: Response) => Promise<void>) => 
        async (req: Request<MovimientoStockParams>, res: Response, next: (err?: any) => void) => {
            try {
                await fn(req, res);
            } catch (error) {
                next(error);
            }
        };

    // Rutas CRUD básicas
    router.get('/', asyncHandler(controller.getAll));
    router.get('/:id', asyncHandler(controller.getById));
    router.post('/', asyncHandler(controller.create));

    // Ruta específica
    router.get('/producto/:producto_id', asyncHandler(controller.getByProducto));

    return router;
}
