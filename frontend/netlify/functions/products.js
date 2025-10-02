// netlify/functions/productos.js
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycIeVO2WOgDJ-SfWTd3jATRBZJncds8XI2RgLnRuxoCGWTy3npsJcmgwR7ZRfMDcSe4A/exec'

let cache = null
let cacheTime = null
const CACHE_DURATION = 30 * 60 * 1000

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800'
    }

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' }
    }

    if (event.httpMethod === 'GET') {
        try {
            const now = Date.now()
            const forceRefresh = event.queryStringParameters?.refresh === 'true'

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

            console.log('Fetching from Google Script:', GOOGLE_SCRIPT_URL)

            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 25000)

            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json'
                }
            })

            clearTimeout(timeoutId)

            console.log('Response status:', response.status)
            console.log('Response headers:', response.headers.get('content-type'))

            // DEBUG: Ver qué estamos recibiendo
            const textResponse = await response.text()
            console.log('Response preview:', textResponse.substring(0, 200))

            // Intentar parsear como JSON
            let data
            try {
                data = JSON.parse(textResponse)
            } catch (parseError) {
                console.error('JSON parse error:', parseError.message)
                throw new Error(`Response is not valid JSON. Got: ${textResponse.substring(0, 100)}`)
            }

            console.log('Products received:', data.productos?.length || 0)

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