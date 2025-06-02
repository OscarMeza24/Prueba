<?php
require_once 'models/Alerta.php';
require_once 'services/IAService.php';

class AlertaService {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function obtenerAlertasActivas() {
        $sql = "
            SELECT a.*, 
                   p.nombre as producto_nombre,
                   p.codigo_barras,
                   p.cantidad_stock,
                   p.precio_unitario,
                   np.nombre as prioridad_nombre,
                   np.color_hex
            FROM alertas a
            LEFT JOIN productos p ON a.producto_id = p.id
            LEFT JOIN niveles_prioridad np ON a.nivel_prioridad_id = np.id
            WHERE a.estado = 'activa'
            ORDER BY a.nivel_prioridad_id DESC, a.fecha_creacion DESC
        ";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function generarAlertasInteligentes() {
        // Obtener productos próximos a vencer
        $sql = "
            SELECT * FROM productos 
            WHERE fecha_caducidad >= CURRENT_DATE 
            AND fecha_caducidad <= CURRENT_DATE + INTERVAL '14 days'
            AND estado IN ('activo', 'proximo_vencer')
        ";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $productos = $stmt->fetchAll();
        
        $alertasGeneradas = [];
        
        foreach ($productos as $producto) {
            $diasRestantes = $this->calcularDiasRestantes($producto['fecha_caducidad']);
            
            // Verificar si ya existe una alerta activa para este producto
            if ($this->existeAlertaActiva($producto['id'], 'vencimiento')) {
                continue;
            }
            
            // Aplicar IA para clasificar prioridad
            $clasificacionIA = IAService::clasificarPrioridadAlerta(
                $diasRestantes,
                $producto['cantidad_stock'],
                $producto['precio_unitario'] ?? 0
            );
            
            // Crear mensaje personalizado
            $mensaje = $this->generarMensajeAlerta($producto, $diasRestantes);
            
            // Crear alerta
            $alerta = new Alerta([
                'producto_id' => $producto['id'],
                'tipo_alerta' => 'vencimiento',
                'mensaje' => $mensaje,
                'nivel_prioridad_id' => $clasificacionIA['prioridad'],
                'fecha_vencimiento' => $producto['fecha_caducidad'],
                'clasificacion_ia' => $clasificacionIA['clasificacion'] . ' - ' . $clasificacionIA['recomendacion']
            ]);
            
            $alertaId = $this->crearAlerta($alerta);
            
            if ($alertaId) {
                $alerta->id = $alertaId;
                $alertasGeneradas[] = $alerta->toArray();
            }
        }
        
        return $alertasGeneradas;
    }
    
    public function actualizarAlerta($alertaId, $estado, $comentario = '', $usuario = 'sistema') {
        try {
            $this->db->beginTransaction();
            
            // Actualizar alerta
            $sql = "UPDATE alertas SET estado = ? WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$estado, $alertaId]);
            
            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }
    
    private function crearAlerta($alerta) {
        $sql = "
            INSERT INTO alertas (
                producto_id, tipo_alerta, mensaje, nivel_prioridad_id, 
                fecha_vencimiento, clasificacion_ia
            ) VALUES (?, ?, ?, ?, ?, ?)
            RETURNING id
        ";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $alerta->producto_id,
            $alerta->tipo_alerta,
            $alerta->mensaje,
            $alerta->nivel_prioridad_id,
            $alerta->fecha_vencimiento,
            $alerta->clasificacion_ia
        ]);
        
        $result = $stmt->fetch();
        return $result ? $result['id'] : null;
    }
    
    private function existeAlertaActiva($productoId, $tipoAlerta) {
        $sql = "
            SELECT COUNT(*) as count FROM alertas 
            WHERE producto_id = ? AND tipo_alerta = ? AND estado = 'activa'
        ";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$productoId, $tipoAlerta]);
        $result = $stmt->fetch();
        
        return $result['count'] > 0;
    }
    
    private function generarMensajeAlerta($producto, $diasRestantes) {
        if ($diasRestantes <= 0) {
            return "¡URGENTE! El producto '{$producto['nombre']}' ya ha vencido";
        } elseif ($diasRestantes <= 1) {
            return "¡CRÍTICO! El producto '{$producto['nombre']}' vence mañana";
        } elseif ($diasRestantes <= 3) {
            return "El producto '{$producto['nombre']}' vence en {$diasRestantes} días";
        } else {
            return "El producto '{$producto['nombre']}' vence en {$diasRestantes} días - Monitorear";
        }
    }
    
    private function calcularDiasRestantes($fechaCaducidad) {
        $hoy = new DateTime();
        $caducidad = new DateTime($fechaCaducidad);
        $diferencia = $caducidad->diff($hoy);
        return $diferencia->invert ? $diferencia->days : -$diferencia->days;
    }
}
?>
