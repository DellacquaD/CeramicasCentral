import type { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';

interface SubCategory {
    id: number;
    nombre: string;
    descripcion: string;
    valores?: string[];
}

interface Category {
    nombre: string;
    subcategoria: SubCategory[];
}

interface CategoriasData {
    categorias: Record<string, Category>;
}

interface ApiResponse {
    categorias?: Record<string, Category>;
    lastUpdate?: string | null;
    timestamp: string;
    success?: boolean;
    error?: string;
}

// Variables globales tipadas.
let categoriasData: CategoriasData | null = null;
let lastUpdate: string | null = null;

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
    context: Context
) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Manejar preflight requests de CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // POST: Actualizar datos desde Google Sheets
    if (event.httpMethod === 'POST') {
        try {
            if (!event.body) {
                throw new Error('Body requerido para actualizar datos');
            }

            const newData: CategoriasData = JSON.parse(event.body);

            // Validación básica de estructura
            if (!newData.categorias || typeof newData.categorias !== 'object') {
                throw new Error('Estructura JSON inválida: falta objeto categorias');
            }

            // Validación más detallada
            for (const [key, categoria] of Object.entries(newData.categorias)) {
                if (!categoria.nombre || !Array.isArray(categoria.subcategoria)) {
                    throw new Error(`Categoría '${key}' tiene estructura inválida`);
                }

                // Validar subcategorías
                for (const sub of categoria.subcategoria) {
                    if (!sub.id || !sub.nombre || !sub.descripcion) {
                        throw new Error(`Subcategoría inválida en categoría '${key}'`);
                    }
                }
            }

            // Actualizar datos en memoria
            categoriasData = newData;
            lastUpdate = new Date().toISOString();

            console.log('✅ Datos actualizados exitosamente:', lastUpdate);
            console.log('📂 Categorías recibidas:', Object.keys(newData.categorias));

            const response: ApiResponse = {
                success: true,
                lastUpdate,
                timestamp: new Date().toISOString()
            };

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(response)
            };

        } catch (error) {
            console.error('❌ Error en POST:', error);

            const response: ApiResponse = {
                error: error instanceof Error ? error.message : 'Error desconocido procesando datos',
                timestamp: new Date().toISOString()
            };

            return {
                statusCode: 400,
                headers,
                body: JSON.stringify(response)
            };
        }
    }

    // GET: Servir datos al frontend
    if (event.httpMethod === 'GET') {
        // Si no hay datos cargados, devolver estructura vacía con mensaje
        if (!categoriasData) {
            categoriasData = {
                categorias: {
                    "sin_datos": {
                        "nombre": "Sin datos",
                        "subcategoria": [
                            {
                                "id": 0,
                                "nombre": "No hay datos disponibles",
                                "descripcion": "Actualiza desde Google Sheets para cargar las categorías"
                            }
                        ]
                    }
                }
            };
        }

        const response: ApiResponse = {
            ...categoriasData,
            lastUpdate,
            timestamp: new Date().toISOString()
        };

        console.log('📤 Sirviendo datos. Última actualización:', lastUpdate || 'Nunca');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response)
        };
    }

    // Método no permitido
    const response: ApiResponse = {
        error: `Método ${event.httpMethod} no permitido`,
        timestamp: new Date().toISOString()
    };

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify(response)
    };
};