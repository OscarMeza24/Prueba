import { Producto } from "../entities/Producto";
import { getConnection } from "typeorm";

export class IAProductoService {
    async clasificarProductosProximosAVencer(): Promise<void> {
        const productoRepo = getConnection().getRepository(Producto);
        const productos = await productoRepo.find();
        
        // Simulación de modelo IA (en producción sería un modelo entrenado)
        const hoy = new Date();
        const umbralDias = 7; // Productos que caducan en 7 días
        
        for (const producto of productos) {
            const diasRestantes = Math.floor(
                (producto.fecha_caducidad.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
            );
            
            if (diasRestantes <= umbralDias) {
                producto.proximo_vencer = true;
                // Asignar prioridad basada en días restantes y tipo de producto
                producto.nivel_prioridad = this.calcularPrioridad(diasRestantes, producto.categoria);
                await productoRepo.save(producto);
            }
        }
    }

    private calcularPrioridad(dias: number, categoria: any): number {
        // Lógica de priorización simulada
        if (dias <= 2) return 5; // Máxima prioridad
        if (dias <= 4) return 4;
        return 3; // Prioridad media
    }
}