// netlify/functions/get-categories.js
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxtQjtC27hVj0vjaHyaV5hYt-LeWSXnVHMVV7PfifGR-YycrZ5uPnj7CIVT7GNgxazOXg/exec'

let cache = null
let cacheTime = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
    }

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' }
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        }
    }

    try {
        const now = Date.now()
        const forceRefresh = event.queryStringParameters?.refresh === 'true'

        // Usar cache si es válido
        if (!forceRefresh && cache && cacheTime && (now - cacheTime) < CACHE_DURATION) {
            console.log('Using cache')
            headers['X-Cache'] = 'HIT'
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(cache)
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
        console.log('Categories received:', Object.keys(data.categorias || {}).length)

        // Actualizar cache
        cache = data
        cacheTime = now

        headers['X-Cache'] = 'MISS'

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        }

    } catch (error) {
        console.error('Error:', error.message)

        // Si hay cache viejo, usarlo
        if (cache) {
            console.log('Using stale cache')
            headers['X-Cache'] = 'STALE'
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(cache)
            }
        }

        // Si no hay cache, error
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message,
                details: 'Could not fetch from Google Script and no cache available'
            })
        }
    }
}