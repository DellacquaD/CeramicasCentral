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

// Cache en memoria
let cachedData: GoogleScriptResponse | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000

// Función para obtener datos desde Google Apps Script
async function fetchFromGoogleScript(): Promise<GoogleScriptResponse> {
    console.log('Fetching data from Google Apps Script...')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

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

        if (!response.ok) {
            throw new Error(`Google Script responded with ${response.status}: ${response.statusText}`)
        }

        const rawText = await response.text()
        console.log('Raw response:', rawText.substring(0, 500))

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
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout: Google Apps Script took too long')
            }
            throw error
        }
        throw new Error('Unknown error fetching data')
    }
}

// Datos de fallback
function getFallbackData(): GoogleScriptResponse {
    return {
        categorias: {
            revestimientos: {
                nombre: "Revestimientos",
                portada: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop",
                subcategoria: [{
                    id: 1,
                    nombre: "Ceramica/Porcelanato",
                    descripcion: "Revestimientos cerámicos de alta calidad"
                }]
            }
        },
        lastUpdate: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        source: "fallback"
    }
}

// Handler principal
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'Vary': 'Accept-Encoding'
    }

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' }
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        }
    }

    try {
        const now = Date.now()
        const forceRefresh = event.queryStringParameters?.refresh === 'true'
        const isCacheValid = cachedData && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION

        let data: GoogleScriptResponse

        if (!forceRefresh && isCacheValid) {
            console.log('Using cached data')
            data = cachedData!
            headers['X-Cache'] = 'HIT'
        } else {
            console.log('Fetching fresh data')
            headers['X-Cache'] = 'MISS'

            try {
                data = await fetchFromGoogleScript()
                cachedData = data
                cacheTimestamp = now
                console.log('Data cached successfully')
            } catch (error) {
                console.error('Error:', error)
                data = cachedData || getFallbackData()
                headers['X-Cache'] = cachedData ? 'STALE' : 'FALLBACK'
            }
        }

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