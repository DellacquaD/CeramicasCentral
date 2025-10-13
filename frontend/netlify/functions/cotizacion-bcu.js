// netlify/functions/cotizacion-bcu.js
// Función para obtener y cachear la cotización del BCU

const BCU_URL = 'https://cotizaciones.bcu.gub.uy/wscotizaciones/servlet/awsbcucotizaciones';

// Almacenamiento en memoria (se resetea con cada cold start de la función)
let cotizacionCache = null;
let ultimaActualizacion = null;

/**
 * Construye el XML SOAP para consultar al BCU
 */
function buildSoapBody(fecha) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:cot="Cotiza">
   <soapenv:Header/>
   <soapenv:Body>
      <cot:wsbcucotizaciones.Execute>
         <cot:Entrada>
            <cot:Moneda>
               <cot:item>2225</cot:item>
            </cot:Moneda>
            <cot:FechaDesde>${fecha}</cot:FechaDesde>
            <cot:FechaHasta>${fecha}</cot:FechaHasta>
            <cot:Grupo>0</cot:Grupo>
         </cot:Entrada>
      </cot:wsbcucotizaciones.Execute>
   </soapenv:Body>
</soapenv:Envelope>`;
}

/**
 * Extrae el valor TCV del XML de respuesta
 */
function parseValorDolar(xmlString) {
    const match = xmlString.match(/<TCV>([\d.]+)<\/TCV>/);
    if (!match) {
        throw new Error('No se encontró la cotización en la respuesta del BCU');
    }
    return parseFloat(match[1]);
}

/**
 * Consulta la cotización al BCU
 */
async function consultarBCU(fecha) {
    console.log(`🔄 Consultando cotización al BCU para ${fecha}...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

    try {
        const response = await fetch(BCU_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': ''
            },
            body: buildSoapBody(fecha),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Error HTTP del BCU: ${response.status}`);
        }

        const xmlText = await response.text();
        const valor = parseValorDolar(xmlText);

        console.log(`✅ Cotización obtenida: $${valor}`);
        return valor;

    } catch (error) {
        clearTimeout(timeoutId);
        console.error('❌ Error al consultar BCU:', error.message);
        throw error;
    }
}

/**
 * Verifica si el cache es válido (menos de 24 horas)
 */
function cacheValido() {
    if (!cotizacionCache || !ultimaActualizacion) {
        return false;
    }

    const horasTranscurridas = (Date.now() - ultimaActualizacion) / (1000 * 60 * 60);
    return horasTranscurridas < 24;
}

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 */
function obtenerFechaHoy() {
    const fecha = new Date();
    // Ajustar a timezone de Uruguay (UTC-3)
    fecha.setHours(fecha.getHours() - 3);
    return fecha.toISOString().split('T')[0];
}

/**
 * Handler principal de Netlify
 */
exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400' // Cache de 24 horas en CDN
    };

    // Manejar OPTIONS para CORS
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // Verificar si necesitamos actualizar
        const forzarActualizacion = event.queryStringParameters?.forzar === 'true';

        if (forzarActualizacion || !cacheValido()) {
            // Consultar al BCU
            const fecha = obtenerFechaHoy();
            const valor = await consultarBCU(fecha);

            // Actualizar cache
            cotizacionCache = {
                valor,
                fecha,
                ultimaActualizacion: new Date().toISOString()
            };
            ultimaActualizacion = Date.now();

            console.log('💾 Cotización guardada en cache');
        } else {
            console.log('📊 Usando cotización del cache');
        }

        // Retornar respuesta
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                cotizacion: cotizacionCache.valor,
                fecha: cotizacionCache.fecha,
                ultimaActualizacion: cotizacionCache.ultimaActualizacion,
                fuente: cacheValido() ? 'cache' : 'bcu',
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('❌ Error en cotizacion-bcu:', error.message);

        // Si hay un valor en cache, usarlo como fallback
        if (cotizacionCache) {
            console.log('⚠️ Usando cotización del cache como fallback');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    cotizacion: cotizacionCache.valor,
                    fecha: cotizacionCache.fecha,
                    ultimaActualizacion: cotizacionCache.ultimaActualizacion,
                    fuente: 'cache-fallback',
                    advertencia: 'No se pudo actualizar, usando última cotización conocida',
                    timestamp: new Date().toISOString()
                })
            };
        }

        // Si no hay cache, retornar error
        return {
            statusCode: 503,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'No se pudo obtener la cotización del BCU',
                detalle: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};