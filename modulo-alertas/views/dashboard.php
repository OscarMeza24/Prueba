<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SafeAlert - Alertas y Reportes</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <header class="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md">
        <div class="container mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <i class="fas fa-exclamation-triangle text-2xl"></i>
                    <div>
                        <h1 class="text-2xl font-bold">SafeAlert</h1>
                        <p class="text-sm text-red-100">Módulo de Alertas y Reportes</p>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <div class="container mx-auto px-4 py-8">
        <!-- Hero Section -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div class="md:flex">
                <div class="md:w-1/2 p-8">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">Sistema de Alertas Inteligentes</h2>
                    <p class="text-gray-600 mb-6">
                        Monitoreo automático con IA para detectar productos próximos a vencer y generar 
                        reportes estadísticos para optimizar la gestión de inventario.
                    </p>
                    <div class="flex space-x-4">
                        <button onclick="generarAlertas()" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors flex items-center">
                            <i class="fas fa-magic mr-2"></i> Generar Alertas IA
                        </button>
                        <button onclick="generarReporte()" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-full transition-colors flex items-center">
                            <i class="fas fa-chart-line mr-2"></i> Generar Reporte
                        </button>
                    </div>
                </div>
                <div class="md:w-1/2 bg-red-100 flex items-center justify-center p-8">
                    <div class="text-center">
                        <i class="fas fa-brain text-red-600 text-6xl mb-4"></i>
                        <div class="text-red-800 font-bold text-xl">Powered by AI</div>
                        <p class="text-red-700 mt-2">Priorización inteligente de alertas</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Alertas Activas</p>
                        <p class="text-2xl font-bold text-red-600" id="alertas-activas">-</p>
                    </div>
                    <i class="fas fa-bell text-red-500 text-2xl"></i>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Productos Críticos</p>
                        <p class="text-2xl font-bold text-orange-600" id="productos-criticos">-</p>
                    </div>
                    <i class="fas fa-exclamation-triangle text-orange-500 text-2xl"></i>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Productos Salvados</p>
                        <p class="text-2xl font-bold text-green-600" id="productos-salvados">-</p>
                    </div>
                    <i class="fas fa-check-circle text-green-500 text-2xl"></i>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Dinero Ahorrado</p>
                        <p class="text-2xl font-bold text-blue-600" id="dinero-ahorrado">-</p>
                    </div>
                    <i class="fas fa-euro-sign text-blue-500 text-2xl"></i>
                </div>
            </div>
        </div>

        <!-- Alertas Recientes -->
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b">
                <h3 class="text-xl font-bold text-gray-800 flex items-center">
                    <i class="fas fa-bell text-red-600 mr-2"></i>
                    Alertas Recientes
                </h3>
            </div>
            <div class="p-6">
                <div id="alertas-container">
                    <div class="text-center py-8">
                        <i class="fas fa-spinner fa-spin text-gray-400 text-2xl mb-2"></i>
                        <p class="text-gray-500">Cargando alertas...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Variables globales
        let alertasData = [];

        // Cargar datos al iniciar
        document.addEventListener('DOMContentLoaded', function() {
            cargarDatos();
        });

        async function cargarDatos() {
            try {
                // Cargar alertas
                const alertasResponse = await fetch('/api/alertas');
                const alertasResult = await alertasResponse.json();
                alertasData = alertasResult.alertas || [];
                
                // Actualizar estadísticas
                actualizarEstadisticas();
                
                // Mostrar alertas
                mostrarAlertas();
                
            } catch (error) {
                console.error('Error cargando datos:', error);
            }
        }

        function actualizarEstadisticas() {
            const alertasActivas = alertasData.filter(a => a.estado === 'activa').length;
            const productosCriticos = alertasData.filter(a => a.nivel_prioridad_id >= 3).length;
            
            document.getElementById('alertas-activas').textContent = alertasActivas;
            document.getElementById('productos-criticos').textContent = productosCriticos;
        }

        function mostrarAlertas() {
            const container = document.getElementById('alertas-container');
            
            if (alertasData.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8">
                        <i class="fas fa-check-circle text-green-500 text-3xl mb-2"></i>
                        <p class="text-gray-600">No hay alertas activas</p>
                    </div>
                `;
                return;
            }

            const alertasHTML = alertasData.slice(0, 5).map(alerta => {
                const prioridadColor = getPrioridadColor(alerta.nivel_prioridad_id);
                
                return `
                    <div class="border-l-4 ${prioridadColor.border} bg-${prioridadColor.bg} p-4 mb-4 rounded-r-lg">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <h4 class="font-semibold text-gray-800">${alerta.producto_nombre || 'Producto'}</h4>
                                <p class="text-sm text-gray-600 mt-1">${alerta.mensaje}</p>
                                ${alerta.clasificacion_ia ? `<p class="text-xs text-blue-600 mt-2">IA: ${alerta.clasificacion_ia}</p>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = alertasHTML;
        }

        function getPrioridadColor(prioridad) {
            switch(prioridad) {
                case 4: return { border: 'border-red-500', bg: 'red-50' };
                case 3: return { border: 'border-orange-500', bg: 'orange-50' };
                case 2: return { border: 'border-yellow-500', bg: 'yellow-50' };
                default: return { border: 'border-blue-500', bg: 'blue-50' };
            }
        }

        async function generarAlertas() {
            try {
                const response = await fetch('/api/alertas/generar', {
                    method: 'POST'
                });
                
                const result = await response.json();
                
                if (result.alertas_generadas > 0) {
                    alert(`Se generaron ${result.alertas_generadas} nuevas alertas`);
                    await cargarDatos();
                } else {
                    alert('No se generaron nuevas alertas');
                }
                
            } catch (error) {
                console.error('Error generando alertas:', error);
                alert('Error al generar alertas');
            }
        }

        async function generarReporte() {
            try {
                const fechaFin = new Date().toISOString().split('T')[0];
                const fechaInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                
                const response = await fetch('/api/reportes/generar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fecha_inicio: fechaInicio,
                        fecha_fin: fechaFin,
                        tipo_reporte: 'desperdicio'
                    })
                });
                
                const result = await response.json();
                
                // Actualizar estadísticas con el reporte
                if (result.reporte && result.reporte.estadisticas) {
                    document.getElementById('productos-salvados').textContent = result.reporte.estadisticas.productos_salvados;
                    document.getElementById('dinero-ahorrado').textContent = '€' + result.reporte.estadisticas.dinero_ahorrado.toFixed(2);
                }
                
                alert('Reporte generado exitosamente');
                
            } catch (error) {
                console.error('Error generando reporte:', error);
                alert('Error al generar reporte');
            }
        }
    </script>
</body>
</html>
