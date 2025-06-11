import { OpenAI } from 'openai';
import Logger from '../utils/logger';

export class IAService {
    private openai: OpenAI;
    
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    /**
     * Analiza el inventario y sugiere optimizaciones
     */
    async analizarInventario(productos: any[]): Promise<string> {
        try {
            const prompt = `
            Eres un experto en gestión de inventario. Analiza los siguientes productos:
            ${JSON.stringify(productos)}
            
            Proporciona recomendaciones sobre:
            1. Productos que deberían tener stock mínimo más alto
            2. Productos que podrían tener stock mínimo más bajo
            3. Patrones de consumo que se puedan identificar
            4. Sugerencias de reordenación
            `;

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            });

            return completion.choices[0].message.content || 'No se pudo generar recomendaciones';
        } catch (error) {
            Logger.error('Error al analizar inventario con IA:', error);
            throw new Error('Error al procesar el análisis de inventario');
        }
    }

    /**
     * Predice la demanda futura basada en el historial
     */
    async predecirDemanda(movimientos: any[]): Promise<string> {
        try {
            const prompt = `
            Eres un experto en análisis de datos. Analiza los siguientes movimientos de stock:
            ${JSON.stringify(movimientos)}
            
            Proporciona una predicción de la demanda futura para los próximos 30 días
            y sugiere acciones preventivas.
            `;

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            });

            return completion.choices[0].message.content || 'No se pudo generar predicción';
        } catch (error) {
            Logger.error('Error al predecir demanda con IA:', error);
            throw new Error('Error al procesar la predicción de demanda');
        }
    }
}
