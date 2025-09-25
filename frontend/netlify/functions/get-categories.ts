// netlify/functions/get-categories.ts

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

interface Subcategoria {
    id: number
    nombre: string
    descripcion: string
    image?: string
    valores?: string[]
}

interface Categoria {
    nombre: string
    portada: string
    subcategoria: Subcategoria[]
}

interface GoogleScriptResponse {
    categorias: Record<string, Categoria>
    lastUpdate: string
    timestamp: string
    source?: string
}

interface ErrorResponse {
    error: string
    categorias: Record<string, never>
    lastUpdate: string
    timestamp: string
    source: string
}

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxtQjtC27hVj0vjaHyaV5hYt-LeWSXnVHMVV7PfifGR-YycrZ5uPnj7CIVT7GNgxazOXg/exec'

// Cache en memoria (se mantiene mientras la función está activa)
let cachedData: GoogleScriptResponse | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos en milisegundos

console.log("About to fetch from Google Script URL:", GOOGLE_SCRIPT_URL);
data = await fetchFromGoogleScript();

// Función para obtener datos desde Google Apps Script
async function fetchFromGoogleScript(): Promise<GoogleScriptResponse> {
    console.log('Fetching data from Google Apps Script...')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const rawText = await response.text();
    console.log('Raw response from Google Script:', rawText.substring(0, 300));

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Netlify-Function/1.0'
            },
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        const rawText = await response.text()
        console.log('Raw response:', rawText.substring(0, 500)) // loguea los primeros 500 chars

        if (!response.ok) {
            throw new Error(`Google Script responded with ${response.status}: ${response.statusText}`)
        }

        let data: GoogleScriptResponse
        try {
            data = JSON.parse(rawText)
        } catch (e) {
            throw new Error(`Invalid JSON: ${rawText.substring(0, 200)}`)
        }

        if (!data.categorias || typeof data.categorias !== 'object') {
            throw new Error('Invalid response structure from Google Apps Script')
        }

        console.log('Data successfully fetched from Google Apps Script')
        return data

    } catch (error) {
        clearTimeout(timeoutId)
        throw error instanceof Error ? error : new Error('Unknown error fetching data')
    }
}


// Datos de fallback
function getFallbackData(): GoogleScriptResponse {
    return {
        categorias: {
            revestimientos: {
                nombre: "Revestimientos",
                portada: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop",
                subcategoria: [
                    {
                        id: 1,
                        nombre: "Ceramica/Porcelanato",
                        descripcion: "Revestimientos cerámicos de alta calidad"
                    }
                ]
            },
            pisos: {
                nombre: "Pisos",
                portada: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
                subcategoria: [
                    {
                        id: 5,
                        nombre: "Porcelanatos",
                        descripcion: "Pisos de porcelanato resistentes"
                    }
                ]
            },
            cocina: {
                nombre: "Cocina",
                portada: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
                subcategoria: [
                    {
                        id: 8,
                        nombre: "Mesadas",
                        descripcion: "Mesadas para cocina"
                    }
                ]
            },
            griferia: {
                nombre: "Grifería",
                portada: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop",
                subcategoria: [
                    {
                        id: 11,
                        nombre: "Grifería Cocina",
                        descripcion: "Grifería para cocina"
                    }
                ]
            },
            bano: {
                nombre: "Baño",
                portada: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop",
                subcategoria: [
                    {
                        id: 13,
                        nombre: "Sanitarios",
                        descripcion: "Sanitarios y accesorios"
                    }
                ]
            }
        },
        lastUpdate: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        source: "fallback"
    }
}

// Handler principal
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    // Headers CORS y cache optimizados
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 minutos de cache
        'Vary': 'Accept-Encoding'
    }

    // Manejar preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        }
    }

    // Solo permitir GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                error: 'Method Not Allowed',
                message: 'Only GET requests are supported'
            })
        }
    }

    try {
        const now = Date.now()
        const forceRefresh = event.queryStringParameters?.refresh === 'true'

        // Verificar si tenemos datos en cache y están frescos
        const isCacheValid = cachedData &&
            cacheTimestamp &&
            (now - cacheTimestamp) < CACHE_DURATION

        let data: GoogleScriptResponse

        if (!forceRefresh && isCacheValid) {
            console.log('Using cached data')
            data = cachedData!

            headers['X-Cache'] = 'HIT'
            headers['X-Cache-Age'] = Math.floor((now - cacheTimestamp) / 1000).toString()
        } else {
            console.log('Fetching fresh data')
            headers['X-Cache'] = 'MISS'

            try {
                data = await fetchFromGoogleScript()

                cachedData = data
                cacheTimestamp = now

                console.log('Data cached successfully')

            } catch (error) {
                console.error('Error fetching from Google Apps Script:', error)

                if (cachedData) {
                    console.log('Using stale cached data as fallback')
                    data = cachedData
                    headers['X-Cache'] = 'STALE'
                    headers['X-Cache-Age'] = Math.floor((now - cacheTimestamp) / 1000).toString()
                } else {
                    console.log('Using fallback data')
                    data = getFallbackData()
                    headers['X-Cache'] = 'FALLBACK'
                }
            }
        }

        // Agregar metadata útil
        const responseData = {
            ...data,
            metadata: {
                cached: isCacheValid && !forceRefresh,
                cacheAge: cacheTimestamp ? Math.floor((now - cacheTimestamp) / 1000) : 0,
                totalCategories: Object.keys(data.categorias).length,
                totalSubcategories: Object.values(data.categorias)
                    .reduce((total, cat) => total + (cat.subcategoria?.length || 0), 0)
            }
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(responseData)
        }

    } catch (error) {
        console.error('Handler error:', error)

        const errorResponse: ErrorResponse = {
            error: error instanceof Error ? error.message : 'Unknown server error',
            categorias: {},
            lastUpdate: new Date().toISOString(),
            timestamp: new Date().toISOString(),
            source: "error"
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify(errorResponse)
        }
    }
}

export { handler }