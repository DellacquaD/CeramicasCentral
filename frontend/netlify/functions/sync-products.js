// netlify/functions/sync-products.js
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwm54gDm3BjiSPUIMmDnQk4tVNmXfUAt0Ac4GNEIhtMdkhndYcdeV0ze99N3qmDzXEwSw/exec'

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' }
    }

    // Solo aceptar POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        }
    }

    try {
        console.log('📨 Webhook recibido desde Google Sheets')

        // Parsear el body si viene
        let webhookData = {}
        if (event.body) {
            try {
                webhookData = JSON.parse(event.body)
                console.log('Datos del webhook:', webhookData)
            } catch (e) {
                console.log('No se pudo parsear body, continuando...')
            }
        }

        // Fetch datos frescos desde Google Apps Script
        console.log('Fetching desde:', GOOGLE_SCRIPT_URL)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 25000)

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'GET',
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        console.log('Response status:', response.status)

        if (!response.ok) {
            throw new Error(`Error fetching from Google Script: ${response.status}`)
        }

        const data = await response.json()

        // Validar estructura
        if (!data.productos || !Array.isArray(data.productos)) {
            throw new Error('Estructura de datos inválida: falta array de productos')
        }

        console.log(`✅ ${data.productos.length} productos recibidos desde Google Sheets`)

        // Aquí NO guardamos en cache porque esta función es solo para sincronizar
        // El cache se maneja en la función productos.js

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                mensaje: 'Sincronización exitosa',
                totalProductos: data.productos.length,
                ultimaActualizacion: data.ultimaActualizacion || new Date().toISOString(),
                timestamp: new Date().toISOString()
            })
        }

    } catch (error) {
        console.error('❌ Error en sync-productos:', error.message)

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            })
        }
    }
}