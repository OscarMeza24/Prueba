<?php
class Alerta {
    public $id;
    public $producto_id;
    public $tipo_alerta;
    public $mensaje;
    public $nivel_prioridad_id;
    public $fecha_creacion;
    public $fecha_vencimiento;
    public $estado;
    public $clasificacion_ia;
    
    public function __construct($data = []) {
        $this->id = $data['id'] ?? null;
        $this->producto_id = $data['producto_id'] ?? null;
        $this->tipo_alerta = $data['tipo_alerta'] ?? '';
        $this->mensaje = $data['mensaje'] ?? '';
        $this->nivel_prioridad_id = $data['nivel_prioridad_id'] ?? null;
        $this->fecha_creacion = $data['fecha_creacion'] ?? date('Y-m-d H:i:s');
        $this->fecha_vencimiento = $data['fecha_vencimiento'] ?? null;
        $this->estado = $data['estado'] ?? 'activa';
        $this->clasificacion_ia = $data['clasificacion_ia'] ?? '';
    }
    
    public function toArray() {
        return [
            'id' => $this->id,
            'producto_id' => $this->producto_id,
            'tipo_alerta' => $this->tipo_alerta,
            'mensaje' => $this->mensaje,
            'nivel_prioridad_id' => $this->nivel_prioridad_id,
            'fecha_creacion' => $this->fecha_creacion,
            'fecha_vencimiento' => $this->fecha_vencimiento,
            'estado' => $this->estado,
            'clasificacion_ia' => $this->clasificacion_ia
        ];
    }
}
?>
