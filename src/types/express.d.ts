import { Request } from 'express';
import { User } from '@supabase/supabase-js';

declare namespace Express {
    interface Request {
        user?: User;
    }
}
