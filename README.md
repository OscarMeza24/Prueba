# Módulo de Inventario - SafeAlert

## Descripción

Este módulo es una API REST completa para la gestión de inventario, construida con TypeScript y Express.js. La API se integra con Supabase como base de datos y proporciona funcionalidades completas para la gestión de productos, almacenes, categorías, movimientos de stock y proveedores.

## Características

- **Gestión de Productos**:
  - CRUD completo de productos
  - Búsqueda por proveedor
  - Búsqueda de productos por vencer
  - Asignación de categorías

- **Gestión de Almacenes**:
  - CRUD de almacenes
  - Control de capacidad
  - Ubicación y estado

- **Gestión de Categorías**:
  - CRUD de categorías
  - Clasificación de productos

- **Movimientos de Stock**:
  - Registro de entradas y salidas
  - Seguimiento por producto
  - Tipos de movimientos
  - Descripciones detalladas

- **Gestión de Proveedores**:
  - CRUD de proveedores
  - Relación con productos
  - Historial de movimientos

## Requisitos

- Node.js (versión 16 o superior)
- TypeScript
- Supabase (base de datos)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd inventory-module
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_key_de_supabase
PORT=3000
```

4. Iniciar el servidor:
```bash
npm start
```

## Endpoints

### Productos
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/:id` - Obtener producto por ID
- `POST /api/productos` - Crear nuevo producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto
- `GET /api/productos/por-vencer` - Productos por vencer
- `GET /api/productos/proveedor/:proveedorId` - Productos por proveedor
- `GET /api/productos/categoria/:categoriaId` - Productos por categoría

### Almacenes
- `GET /api/almacenamiento` - Obtener todos los almacenes
- `GET /api/almacenamiento/:id` - Obtener almacenamiento por ID
- `POST /api/almacenamiento` - Crear nuevo almacenamiento
- `PUT /api/almacenamiento/:id` - Actualizar almacenamiento
- `DELETE /api/almacenamiento/:id` - Eliminar almacenamiento

### Categorías
- `GET /api/categorias` - Obtener todas las categorías
- `GET /api/categorias/:id` - Obtener categoría por ID
- `POST /api/categorias` - Crear nueva categoría
- `PUT /api/categorias/:id` - Actualizar categoría
- `DELETE /api/categorias/:id` - Eliminar categoría

### Movimientos de Stock
- `GET /api/movimientos` - Obtener todos los movimientos
- `GET /api/movimientos/:id` - Obtener movimiento por ID
- `POST /api/movimientos` - Crear nuevo movimiento
- `GET /api/movimientos/producto/:producto_id` - Movimientos por producto

### Proveedores
- `GET /api/proveedores` - Obtener todos los proveedores
- `GET /api/proveedores/:id` - Obtener proveedor por ID
- `POST /api/proveedores` - Crear nuevo proveedor
- `PUT /api/proveedores/:id` - Actualizar proveedor
- `DELETE /api/proveedores/:id` - Eliminar proveedor
- `GET /api/proveedores/:id/productos` - Productos por proveedor

## Estructura del Proyecto

```
src/
├── controllers/           # Controladores de la API
├── services/             # Servicios de negocio
├── routes/               # Definición de rutas
├── middleware/           # Middleware de Express
├── utils/               # Utilidades y helpers
└── index.ts             # Punto de entrada de la aplicación
```

## Tecnologías Utilizadas

- TypeScript
- Express.js
- Supabase
- Class-validator
- Helmet
- CORS
- Compression

## Manejo de Errores

La API utiliza un sistema de manejo de errores consistente que devuelve:
- Código HTTP apropiado
- Mensaje de error descriptivo
- Detalles del error cuando es necesario

## Seguridad

- Validación de datos de entrada
- Sanitización de datos
- Protección contra ataques XSS
- CORS configurado
- Helmet para seguridad HTTP

## Contribución

1. Fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

[MIT](LICENSE)
