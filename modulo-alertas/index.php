<?php
require_once 'config/database.php';
require_once 'models/Alerta.php';
require_once 'models/Reporte.php';
require_once 'services/AlertaService.php';
require_once 'services/ReporteService.php';
require_once 'services/IAService.php';

// Configurar headers para CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Obtener la ruta
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Router simple
switch ($path) {
    case '/':
    case '/dashboard':
        include 'views/dashboard.php';
        break;
    
    case '/api/health':
        header('Content-Type: application/json');
        echo json_encode(['status' => 'ok', 'module' => 'alertas', 'port' => 3003]);
        break;
    
    case '/api/alertas':
        handleAlertasAPI();
        break;
    
    case '/api/alertas/generar':
        handleGenerarAlertas();
        break;
    
    case '/api/reportes/generar':
        handleGenerarReporte();
        break;
    
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint no encontrado']);
        break;
}

function handleAlertasAPI() {
    $alertaService = new AlertaService();
    
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $alertas = $alertaService->obtenerAlertasActivas();
            header('Content-Type: application/json');
            echo json_encode(['alertas' => $alertas]);
            break;
        
        case 'PATCH':
            $input = json_decode(file_get_contents('php://input'), true);
            $resultado = $alertaService->actualizarAlerta(
                $input['alerta_id'],
                $input['estado'],
                $input['comentario'] ?? '',
                $input['usuario'] ?? 'sistema'
            );
            header('Content-Type: application/json');
            echo json_encode(['success' => $resultado]);
            break;
        
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
            break;
    }
}

function handleGenerarAlertas() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        return;
    }
    
    $alertaService = new AlertaService();
    $alertasGeneradas = $alertaService->generarAlertasInteligentes();
    
    header('Content-Type: application/json');
    echo json_encode([
        'alertas_generadas' => count($alertasGeneradas),
        'alertas' => $alertasGeneradas
    ]);
}

function handleGenerarReporte() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $reporteService = new ReporteService();
    
    $reporte = $reporteService->generarReporte(
        $input['fecha_inicio'],
        $input['fecha_fin'],
        $input['tipo_reporte'] ?? 'desperdicio'
    );
    
    header('Content-Type: application/json');
    echo json_encode(['reporte' => $reporte]);
}
?>
