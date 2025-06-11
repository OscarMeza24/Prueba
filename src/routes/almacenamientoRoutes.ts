import { Router, Request, Response } from 'express';

export function createRoutes(controller: any) {
    const router = Router();

    const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => 
        async (req: Request, res: Response, next: (err?: any) => void) => {
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
    router.put('/:id', asyncHandler(controller.update));
    router.delete('/:id', asyncHandler(controller.delete));

    return router;
}
