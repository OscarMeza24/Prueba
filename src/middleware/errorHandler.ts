import { Request, Response, NextFunction } from 'express';
import { PostgrestError } from '@supabase/supabase-js';

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public details?: any
    ) {
        super(message);
    }
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    if (err instanceof ApiError) {
        res.status(err.status).json({
            message: err.message,
            details: err.details
        });
    }

    if (err instanceof PostgrestError) {
        res.status(400).json({
            message: `Error de Supabase: ${err.message}`,
            code: err.code,
            details: err.details
        });
    }

    res.status(500).json({
        message: 'Error interno del servidor',
        error: err.message,
        timestamp: new Date().toISOString(),
        path: req.path
    });
};