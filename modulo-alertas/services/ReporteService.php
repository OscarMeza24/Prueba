<?php
require_once 'models/Reporte.php';

class ReporteService {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function generarReporte($fechaInicio, $fechaFin, $tipoReporte = 'desperdicio') {
        // Obtener alertas resueltas en el período
        $alertasResueltas = $this->obtenerAlertasResueltas($fechaInicio, $fechaFin);
        
        // Calcular estadísticas
        $estadisticas = $this->calcularEstadisticas($alertasResueltas);
        
        return [
            'estadisticas' => $estadisticas,
            'recomendaciones' => $this->generarRecomendaciones($estadisticas)
        ];
    }
    
    private function obtenerAlertasResueltas($fechaInicio, $fechaFin) {
        $sql = "
            SELECT a.*, p.precio_unitario, p.cantidad_stock, p.nombre as producto_nombre
            FROM alertas a
            LEFT JOIN productos p ON a.producto_id = p.id
            WHERE a.fecha_creacion >= ? 
            AND a.fecha_creacion <= ?
            AND a.estado = 'resuelta'
        ";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$fechaInicio, $fechaFin]);
        return $stmt->fetchAll();
    }
    
    private function calcularEstadisticas($alertasResueltas) {
        $productosSalvados = 0;
        $dineroAhorrado = 0;
        $kgDesperdicioEvitado = 0;
        
        foreach ($alertasResueltas as $alerta) {
            $productosSalvados++;
            $dineroAhorrado += ($alerta['precio_unitario'] ?? 0) * ($alerta['cantidad_stock'] ?? 0);
            $kgDesperdicioEvitado += ($alerta['cantidad_stock'] ?? 0) * 0.5; // Estimación de 0.5kg por unidad
        }
        
        return [
            'productos_salvados' => $productosSalvados,
            'dinero_ahorrado' => $dineroAhorrado,
            'kg_desperdicio_evitado' => $kgDesperdicioEvitado
        ];
    }
    
    private function generarRecomendaciones($estadisticas) {
        $recomendaciones = [];
        
        if ($estadisticas['productos_salvados'] > 10) {
            $recomendaciones[] = [
                'tipo' => 'exito',
                'mensaje' => "¡Excelente trabajo! Has salvado {$estadisticas['productos_salvados']} productos del desperdicio.",
                'accion' => 'Continuar con las buenas prácticas'
            ];
        }
        
        return $recomendaciones;
    }
}
?>
