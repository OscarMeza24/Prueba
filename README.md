SafeAlert Platform - Sistema Unificado
🎯 Descripción General
SafeAlert es una plataforma modular completa para la gestión inteligente de inventario y reducción de desperdicio alimentario, inspirada en Too Good To Go. El sistema está compuesto por 3 módulos independientes que trabajan de forma coordinada:

🧩 Arquitectura de Módulos
📦 Módulo 1: Gestión de Inventario (TypeScript/Next.js)
Puerto: 3001
Tecnologías: TypeScript, Next.js, Supabase, Tailwind CSS
Funcionalidades:
✅ Gestión completa de productos, categorías y proveedores
🤖 IA para clasificación automática de productos según fecha de caducidad
📊 Dashboard con métricas en tiempo real
🔄 Sistema de movimientos de stock
📱 Interfaz responsive y moderna
🍳 Módulo 2: Recetas Inteligentes (Python/FastAPI)
Puerto: 3002
Tecnologías: Python, FastAPI, OpenAI API, Jinja2, Supabase
Funcionalidades:
🤖 Generación de recetas con OpenAI basadas en productos próximos a vencer
🌐 API RESTful para integración
🎨 Interfaz web intuitiva para selección de productos
📋 Historial de recetas generadas
🔗 Relación automática entre productos y recetas
🚨 Módulo 3: Alertas y Reportes (PHP)
Puerto: 3003
Tecnologías: PHP, PostgreSQL, Chart.js
Funcionalidades:
🤖 IA para priorización automática de alertas
📊 Generación de reportes estadísticos
🔔 Sistema de notificaciones inteligentes
📈 Análisis de tendencias y patrones
💡 Recomendaciones automáticas
🌐 Sistema Unificado (Next.js)
Puerto: 3000
Tecnologías: Next.js, TypeScript, Tailwind CSS
Funcionalidades:
🎛️ Dashboard central que integra todos los módulos
📊 Estadísticas globales en tiempo real
🔗 Navegación entre módulos
📱 Interfaz unificada y responsive
🚀 Instalación y Configuración
📁 Estructura del Proyecto
``` safealert-platform/ ├── sistema-unificado/ # Puerto 3000 - Dashboard principal ├── modulo-inventario/ # Puerto 3001 - Gestión de inventario ├── modulo-recetas/ # Puerto 3002 - Recetas con IA └── modulo-alertas/ # Puerto 3003 - Alertas y reportes ```

1. Prerrequisitos
Node.js 18+
Python 3.8+
PHP 8.1+
Cuenta Supabase (gratis)
API Key OpenAI
2. Configurar Base de Datos
Crear proyecto en https://supabase.com/
Ejecutar el script SQL proporcionado
Obtener credenciales (URL, anon key, service role key)
3. Sistema Unificado (Puerto 3000)
```bash cd sistema-unificado npm install

Configurar .env.local con credenciales Supabase
npm run dev ```

4. Módulo Inventario (Puerto 3001)
```bash cd modulo-inventario npm install

Configurar .env.local con credenciales Supabase
npm run dev -- --port 3001 ```

5. Módulo Recetas (Puerto 3002)
```bash cd modulo-recetas python -m venv venv source venv/bin/activate # Windows: venv\Scripts\activate pip install -r requirements.txt

Configurar .env con credenciales Supabase y OpenAI
uvicorn main:app --port 3002 --reload ```

6. Módulo Alertas (Puerto 3003)
```bash cd modulo-alertas

Configurar .env con credenciales PostgreSQL
php -S localhost:3003 ```

🌐 URLs de Acceso
Dashboard Principal: http://localhost:3000
Módulo Inventario: http://localhost:3001
Módulo Recetas: http://localhost:3002
Módulo Alertas: http://localhost:3003
🔑 Variables de Entorno Necesarias
Todos los módulos:
```env NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key ```

Módulo Recetas adicional:
```env OPENAI_API_KEY=tu_api_key_openai ```

Módulo Alertas:
```env POSTGRES_HOST=db.tu_proyecto.supabase.co POSTGRES_DATABASE=postgres POSTGRES_USER=postgres POSTGRES_PASSWORD=tu_password ```

✅ Verificación
Abrir http://localhost:3000
Verificar que los 3 módulos aparezcan como "En línea"
Probar funcionalidades básicas en cada módulo
¡Listo! Tienes SafeAlert funcionando completamente 🎉

📊 Características de IA Implementadas
🧠 Módulo de Inventario
Clasificación automática de productos según fecha de caducidad
Cálculo de prioridad basado en días restantes y valor económico
Recomendaciones inteligentes para cada producto
Estados automáticos: Normal, Monitorear, Atención, Urgente, Crítico
🤖 Módulo de Recetas
Integración completa con OpenAI (modelo gpt-4o)
Análisis de ingredientes disponibles próximos a vencer
Generación de recetas estructuradas con instrucciones detalladas
Optimización para reducir desperdicio alimentario
🎯 Módulo de Alertas
Sistema de priorización multifactorial:
Factor tiempo (días hasta vencimiento)
Factor cantidad (stock disponible)
Factor económico (valor total del producto)
Clasificación automática en 4 niveles de prioridad
Recomendaciones contextuales para cada alerta
Análisis de tendencias y patrones de desperdicio
🌐 APIs Disponibles
Inventario (Puerto 3001)
GET /api/inventario/productos - Obtener productos con clasificación IA
POST /api/inventario/productos - Crear producto con clasificación automática
GET /api/inventario/categorias - Obtener categorías
POST /api/inventario/movimientos - Registrar movimientos de stock
Recetas (Puerto 3002)
GET /api/recetas - Obtener todas las recetas
POST /api/recetas/generar - Generar receta con OpenAI
GET /recetas/{id} - Ver detalles de receta específica
Alertas (Puerto 3003)
GET /api/alertas - Obtener alertas activas con priorización IA
POST /api/alertas/generar - Generar alertas automáticas
POST /api/reportes/generar - Generar reportes estadísticos
PATCH /api/alertas - Actualizar estado de alertas
📈 Métricas y Reportes
El sistema genera automáticamente:

📊 Estadísticas de desperdicio evitado
💰 Cálculo de ahorro económico
🌱 Impacto ambiental (CO₂ reducido)
📈 Tendencias semanales de vencimientos
🎯 Eficiencia de alertas resueltas
📋 Recomendaciones inteligentes por categoría
🎨 Características de Diseño
✅ Diseño responsive para móviles y escritorio
🎨 Interfaz moderna con Tailwind CSS
🔄 Actualizaciones en tiempo real
📱 Navegación intuitiva entre módulos
🎯 Códigos de color consistentes para estados
📊 Gráficos interactivos con Chart.js
🔗 Integración entre Módulos
Los módulos se comunican a través de:

Base de datos compartida (Supabase/PostgreSQL)
APIs RESTful para intercambio de datos
Dashboard unificado para navegación
Eventos y notificaciones entre sistemas
🚀 Despliegue
Docker (Recomendado)
```bash

Cada módulo incluye su Dockerfile
docker-compose up -d ```

Hosting Individual
Inventario: Vercel, Netlify
Recetas: Railway, Heroku, DigitalOcean
Alertas: Shared hosting con PHP, VPS
Unificado: Vercel, Netlify
📝 Documentación Adicional
Documentación de APIs
Guía de Desarrollo
Manual de Usuario
🤝 Contribución
Las contribuciones son bienvenidas. Por favor:

Fork el repositorio
Crea una rama para tu feature
Commit tus cambios
Push a la rama
Abre un Pull Request
📄 Licencia
Este proyecto está licenciado bajo la Licencia MIT.

SafeAlert Platform - Reduciendo el desperdicio alimentario con inteligencia artificial 🌱🤖

Ejecutar los Módulos
Terminal 1 - Sistema Unificado:
cd sistema-unificado
npm run dev
# Se ejecuta en http://localhost:3000
Terminal 2 - Módulo Inventario:
cd modulo-inventario
npm run dev
# Se ejecuta en http://localhost:3004
Terminal 3 - Módulo Recetas:
cd modulo-recetas
# Activar entorno virtual si no está activo
source venv/bin/activate  # Mac/Linux
# o
venv\Scripts\activate     # Windows

uvicorn main:app --host 0.0.0.0 --port 3005 --reload
# Se ejecuta en http://localhost:3005
Terminal 4 - Módulo Alertas:
cd modulo-alertas
php -S localhost:3006
# Se ejecuta en http://localhost:3006
