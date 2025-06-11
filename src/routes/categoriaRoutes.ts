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
    router.get('/', asyncHandler((req: Request, res: Response) => controller.getAll(req, res)));
    router.get('/:id', asyncHandler((req: Request, res: Response) => controller.getById(req, res)));
    router.post('/', asyncHandler((req: Request, res: Response) => controller.create(req, res)));
    router.put('/:id', asyncHandler((req: Request, res: Response) => controller.update(req, res)));
    router.delete('/:id', asyncHandler((req: Request, res: Response) => controller.delete(req, res)));

    return router;
}
