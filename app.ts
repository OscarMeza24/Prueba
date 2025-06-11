import express from 'express';
import { createConnection } from 'typeorm';
import productoRoutes from './src/routes/productoRoutes';
import almacenamientoRoutes from './src/routes/almacenamientoRoutes';
import categoriaRoutes from './src/routes/categoriaRoutes';
import proveedorRoutes from './src/routes/proveedorRoutes';
import movimientoStockRoutes from './src/routes/movimientoStockRoutes';

const app = express();

// Middleware
app.use(express.json());

// Conexión a la base de datos
createConnection()
    .then(() => {
        console.log('Conectado a la base de datos');
        
        // Rutas
        app.use('/api/productos', productoRoutes);
        app.use('/api/almacenamientos', almacenamientoRoutes);
        app.use('/api/categorias', categoriaRoutes);
        app.use('/api/proveedores', proveedorRoutes);
        app.use('/api/movimientos', movimientoStockRoutes);

        // Puerto
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch(error => console.log(error));

export default app;