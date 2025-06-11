export class OpenAI {
    constructor(config: { apiKey: string }) {}

    chat = {
        completions: {
            create: async () => ({
                choices: [{
                    message: {
                        content: "Mock response: Sugerencias de optimización de inventario"
                    }
                }]
            })
        }
    };
}
