import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SafeAlert - Sistema de Gestión de Inventario',
            version: '1.0.0',
            description: 'API para gestión de inventario con IA',
            contact: {
                name: 'SafeAlert Team',
                email: 'contact@safealert.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.ts']
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
