import { Request } from 'express';

export interface BaseParams {
    id: string;
}

export interface CategoriaParams extends BaseParams {
    id: string;
}

export interface ProductoParams extends BaseParams {
    id: string;
    categoriaId: string;
}

export interface AlmacenamientoParams extends BaseParams {
    id: string;
}

export interface MovimientoStockParams extends BaseParams {
    id: string;
}

export interface ProveedorParams extends BaseParams {
    id: string;
}

export type RequestWithParams<T> = Request<T>;

export type RequestWithCategoriaParams = RequestWithParams<CategoriaParams>;
export type RequestWithProductoParams = RequestWithParams<ProductoParams>;
export type RequestWithAlmacenamientoParams = RequestWithParams<AlmacenamientoParams>;
export type RequestWithMovimientoStockParams = RequestWithParams<MovimientoStockParams>;
export type RequestWithProveedorParams = RequestWithParams<ProveedorParams>;

export type RequestWithBaseParams = RequestWithParams<BaseParams>;
