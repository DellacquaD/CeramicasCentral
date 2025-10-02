// netlify/functions/productos.js
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxuuC0pWJMdMg9_rbN7PXKaO5Ji49954kHN58S2K8wmC5n_fPhszQv7nDqStUvLk8RWdw/exec'

let cache = null
let cacheTime = null
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutos

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800'
    }

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' }
    }

    // POST: Webhook desde Google Sheets (forzar actualización)
    if (event.httpMethod === 'POST') {
        try {
            console.log('Webhook recibido desde Google Sheets')

            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 25000)

            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'GET',
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                throw new Error(`Google Script error: ${response.status}`)
            }

            const data = await response.json()

            if (!data.productos || !Array.isArray(data.productos)) {
                throw new Error('Estructura de datos inválida')
            }

            cache = data
            cacheTime = Date.now()

            console.log(`Cache actualizado: ${data.productos.length} productos`)

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    mensaje: 'Cache actualizado correctamente',
                    totalProductos: data.productos.length,
                    ultimaSincronizacion: new Date().toISOString()
                })
            }

        } catch (error) {
            console.error('Error en webhook:', error.message)
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: error.message,
                    success: false
                })
            }
        }
    }

    // GET: Servir productos
    if (event.httpMethod === 'GET') {
        try {
            const now = Date.now()
            const forceRefresh = event.queryStringParameters?.refresh === 'true'

            // Usar cache si es válido
            if (!forceRefresh && cache && cacheTime && (now - cacheTime) < CACHE_DURATION) {
                console.log('Using cache')
                headers['X-Cache'] = 'HIT'

                const cacheEdad = Math.round((now - cacheTime) / 60000)

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        ...cache,
                        cacheInfo: {
                            ultimaSincronizacion: new Date(cacheTime).toISOString(),
                            edadEnMinutos: cacheEdad,
                            expiraEn: Math.max(0, 30 - cacheEdad)
                        }
                    })
                }
            }

            // Fetch desde Google Script
            console.log('Fetching from Google Script:', GOOGLE_SCRIPT_URL)

            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 25000)

            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'GET',
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            console.log('Response status:', response.status)

            if (!response.ok) {
                throw new Error(`Google Script error: ${response.status}`)
            }

            const data = await response.json()
            console.log('Products received:', data.productos?.length || 0)

            // Actualizar cache
            cache = data
            cacheTime = now

            headers['X-Cache'] = 'MISS'

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ...data,
                    cacheInfo: {
                        ultimaSincronizacion: new Date(cacheTime).toISOString(),
                        edadEnMinutos: 0,
                        expiraEn: 30
                    }
                })
            }

        } catch (error) {
            console.error('Error:', error.message)

            // Si hay cache viejo, usarlo
            if (cache) {
                console.log('Using stale cache')
                headers['X-Cache'] = 'STALE'

                const cacheEdad = Math.round((Date.now() - cacheTime) / 60000)

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        ...cache,
                        warning: 'Datos desde cache (error al actualizar)',
                        cacheInfo: {
                            ultimaSincronizacion: new Date(cacheTime).toISOString(),
                            edadEnMinutos: cacheEdad,
                            esViejo: true
                        }
                    })
                }
            }

            // Si no hay cache, error
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: error.message,
                    details: 'Could not fetch from Google Script and no cache available',
                    productos: [],
                    total: 0
                })
            }
        }
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
    }
}