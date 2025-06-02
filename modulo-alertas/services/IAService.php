<?php
class IAService {
    
    /**
     * Clasifica la prioridad de una alerta usando IA simulada
     */
    public static function clasificarPrioridadAlerta($diasRestantes, $cantidadStock, $precioUnitario) {
        $score = 0;
        
        // Factor tiempo (más peso)
        if ($diasRestantes <= 0) $score += 40;
        elseif ($diasRestantes <= 1) $score += 35;
        elseif ($diasRestantes <= 3) $score += 25;
        elseif ($diasRestantes <= 7) $score += 15;
        elseif ($diasRestantes <= 14) $score += 5;
        
        // Factor cantidad (peso medio)
        if ($cantidadStock > 50) $score += 15;
        elseif ($cantidadStock > 20) $score += 10;
        elseif ($cantidadStock > 5) $score += 5;
        
        // Factor valor económico (peso menor)
        $valorTotal = $cantidadStock * $precioUnitario;
        if ($valorTotal > 500) $score += 10;
        elseif ($valorTotal > 100) $score += 5;
        elseif ($valorTotal > 50) $score += 2;
        
        // Determinar prioridad y clasificación
        if ($score >= 50) {
            return [
                'prioridad' => 4,
                'clasificacion' => '🔴 CRÍTICA - Acción inmediata requerida',
                'recomendacion' => 'Intervención urgente. Considerar descuento del 70% o donación inmediata.'
            ];
        } elseif ($score >= 35) {
            return [
                'prioridad' => 3,
                'clasificacion' => '🟠 ALTA - Atención urgente',
                'recomendacion' => 'Aplicar descuento del 50% o usar en recetas de aprovechamiento.'
            ];
        } elseif ($score >= 20) {
            return [
                'prioridad' => 2,
                'clasificacion' => '🟡 MEDIA - Monitorear de cerca',
                'recomendacion' => 'Promocionar con descuento del 30%. Monitorear diariamente.'
            ];
        } else {
            return [
                'prioridad' => 1,
                'clasificacion' => '🔵 BAJA - Seguimiento rutinario',
                'recomendacion' => 'Mantener seguimiento regular. Planificar estrategias de venta.'
            ];
        }
    }
}
?>
