import { BaseSupabaseService } from './BaseSupabaseService';

export class UbicacionService extends BaseSupabaseService {
    constructor() {
        super('ubicaciones');
    }
}