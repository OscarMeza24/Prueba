import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { ProductoController } from './controllers/ProductoController';
import { AlmacenamientoController } from './controllers/AlmacenamientoController';
import { CategoriaController } from './controllers/CategoriaController';
import { MovimientoStockController } from './controllers/MovimientoStockController';
import { ProveedorController } from './controllers/ProveedorController';
import { ProductoService } from './services/ProductoService';
import { AlmacenamientoService } from './services/AlmacenamientoService';
import { CategoriaService } from './services/CategoriaService';
import { MovimientoStockService } from './services/MovimientoStockService';
import { ProveedorService } from './services/ProveedorService';
import { errorHandler } from './middleware/errorHandler';
import { createRoutes } from './routes/productoRoutes';
import { createRoutes as createAlmacenamientoRoutes } from './routes/almacenamientoRoutes';
import { createRoutes as createCategoriaRoutes } from './routes/categoriaRoutes';
import { createRoutes as createMovimientoStockRoutes } from './routes/movimientoStockRoutes';
import { createRoutes as createProveedorRoutes } from './routes/proveedorRoutes';

console.log('Iniciando servidor...');
console.log('Procesando variables de entorno...');

// Cargar variables de entorno
console.log('Cargando variables de entorno...');
dotenv.config();
console.log('Variables de entorno cargadas');

// Verificar variables de entorno
console.log('Verificando variables de entorno...');
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.error('Faltan variables de entorno para Supabase');
    console.error('URL:', process.env.SUPABASE_URL ? 'Existe' : 'No existe');
    console.error('KEY:', process.env.SUPABASE_KEY ? 'Existe' : 'No existe');
    process.exit(1);
}
console.log('Variables de entorno verificadas correctamente');

// Inicializar servicios y controladores
(async () => {
    try {
        console.log('Inicializando servicios y controladores...');
        
        // Crear servicios y controladores
        const productoService = new ProductoService();
        const almacenamientoService = new AlmacenamientoService();
        const categoriaService = new CategoriaService();
        const movimientoStockService = new MovimientoStockService();
        const proveedorService = new ProveedorService();

        const productoController = new ProductoController();
        const almacenamientoController = new AlmacenamientoController();
        const categoriaController = new CategoriaController();
        const movimientoStockController = new MovimientoStockController();
        const proveedorController = new ProveedorController();
        
        console.log('Servicios y controladores instanciados');

        // Inicializar servicios
        console.log('Iniciando inicialización de servicios...');
        await Promise.all([
            productoService.initialize(),
            almacenamientoService.initialize(),
            categoriaService.initialize(),
            movimientoStockService.initialize(),
            proveedorService.initialize()
        ]);
        console.log('Servicios inicializados correctamente');

        // Asignar servicios a los controladores
        productoController.setService(productoService);
        almacenamientoController.setService(almacenamientoService);
        categoriaController.setService(categoriaService);
        movimientoStockController.setService(movimientoStockService);
        proveedorController.setService(proveedorService);
        
        console.log('Servicios asignados a controladores');

        // Inicializar controladores
        console.log('Iniciando inicialización de controladores...');
        await Promise.all([
            productoController.initialize(),
            almacenamientoController.initialize(),
            categoriaController.initialize(),
            movimientoStockController.initialize(),
            proveedorController.initialize()
        ]);
        console.log('Controladores inicializados correctamente');

        // Verificar que todos los controladores estén inicializados
        console.log('Verificando inicialización de controladores...');
        const controllers = [
            productoController,
            almacenamientoController,
            categoriaController,
            movimientoStockController,
            proveedorController
        ];

        const allInitialized = controllers.every(controller => controller.isInitialized());
        if (!allInitialized) {
            throw new Error('No todos los controladores están inicializados');
        }
        console.log('Controladores verificados correctamente');

        // Crear rutas con los controladores
        console.log('Creando rutas...');
        const productoRoutes = createRoutes(productoController);
        const almacenamientoRoutes = createAlmacenamientoRoutes(almacenamientoController);
        const categoriaRoutes = createCategoriaRoutes(categoriaController);
        const movimientoStockRoutes = createMovimientoStockRoutes(movimientoStockController);
        const proveedorRoutes = createProveedorRoutes(proveedorController);
        console.log('Rutas creadas');

        const app = express();

        // Configurar middleware
        console.log('Configurando middleware...');
        app.use(helmet());
        app.use(cors());
        app.use(compression());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        console.log('Middleware configurado');

        // Ruta raíz
        app.get('/', (req, res) => {
            res.json({
                message: 'API de Inventario',
                endpoints: {
                    productos: '/api/productos',
                    almacenamiento: '/api/almacenamiento',
                    categorias: '/api/categorias',
                    movimientoStock: '/api/movimientos',
                    proveedores: '/api/proveedores'
                }
            });
        });

        // Registrar rutas
        console.log('Registrando rutas...');
        app.use('/api/productos', productoRoutes);
        app.use('/api/almacenamiento', almacenamientoRoutes);
        app.use('/api/categorias', categoriaRoutes);
        app.use('/api/movimientos', movimientoStockRoutes);
        app.use('/api/proveedores', proveedorRoutes);
        console.log('Rutas registradas');

        // Middleware de logging
        app.use((req, res, next) => {
            console.log(`${req.method} ${req.path}`);
            next();
        });

        // Middleware para rutas no encontradas
        app.use((req, res, next) => {
            const error = new Error('Ruta no encontrada');
            error.name = 'NotFoundError';
            next(error);
        });

        // Inicializar aplicación
        console.log('Inicializando aplicación...');
        const PORT = process.env.PORT || 3000;
        console.log('Puerto:', PORT);
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error al inicializar el servidor:', error);
        process.exit(1);
    }
})();
