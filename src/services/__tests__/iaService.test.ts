import { describe, beforeEach, it, expect } from '@jest/globals';
import { IAService } from '../iaService';
import { OpenAI } from 'openai';

describe('IAService', () => {
    let iaService: IAService;
    let mockOpenAI: jest.Mocked<OpenAI>;

    beforeEach(() => {
        mockOpenAI = {
            chat: {
                completions: {
                    create: jest.fn()
                }
            }
        } as unknown as jest.Mocked<OpenAI>;

        iaService = new IAService();
        iaService['openai'] = mockOpenAI;
    });

    it('debería analizar el inventario correctamente', async () => {
        const mockResponse = {
            choices: [{
                message: {
                    content: 'Recomendaciones de optimización...'
                }
            }]
        };

        (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValue(mockResponse);

        const productos = [{ id: 1, nombre: 'Producto 1', stock: 10 }];
        const resultado = await iaService.analizarInventario(productos);

        expect(resultado).toBe('Recomendaciones de optimización...');
        expect(mockOpenAI.chat.completions.create).toHaveBeenCalled();
    });

    it('debería manejar errores al analizar el inventario', async () => {
        (mockOpenAI.chat.completions.create as jest.Mock).mockRejectedValue(new Error('Error de API'));

        const productos = [{ id: 1, nombre: 'Producto 1', stock: 10 }];

        await expect(iaService.analizarInventario(productos))
            .rejects
            .toThrow('Error al procesar el análisis de inventario');
    });
});
