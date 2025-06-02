<?php
class Reporte {
    public $id;
    public $tipo_reporte;
    public $fecha_inicio;
    public $fecha_fin;
    public $datos_json;
    public $productos_salvados;
    public $dinero_ahorrado;
    public $kg_desperdicio_evitado;
    public $created_at;
    
    public function __construct($data = []) {
        $this->id = $data['id'] ?? null;
        $this->tipo_reporte = $data['tipo_reporte'] ?? '';
        $this->fecha_inicio = $data['fecha_inicio'] ?? '';
        $this->fecha_fin = $data['fecha_fin'] ?? '';
        $this->datos_json = $data['datos_json'] ?? '{}';
        $this->productos_salvados = $data['productos_salvados'] ?? 0;
        $this->dinero_ahorrado = $data['dinero_ahorrado'] ?? 0.0;
        $this->kg_desperdicio_evitado = $data['kg_desperdicio_evitado'] ?? 0.0;
        $this->created_at = $data['created_at'] ?? date('Y-m-d H:i:s');
    }
}
?>
