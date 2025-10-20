// netlify/functions/cotizacion-bcu.js
// Función para obtener y cachear la cotización del BCU

const BCU_URL = 'https://cotizaciones.bcu.gub.uy/wscotizaciones/servlet/awsbcucotizaciones';

// Almacenamiento en memoria (se resetea con cada cold start de la función)
let cotizacionCache = null;
let ultimaActualizacion = null;

/**
 * Feriados fijos de Uruguay (mes-día)
 * Lista simplificada de los principales feriados
 */
const FERIADOS_FIJOS = [
    '01-01', // Año Nuevo
    '05-01', // Día del Trabajador
    '07-18', // Jura de la Constitución
    '08-25', // Declaratoria de la Independencia
    '12-25', // Navidad
];

/**
 * Verifica si una fecha es feriado
 */
function esFeriado(fecha) {
    const mesdia = `${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
    return FERIADOS_FIJOS.includes(mesdia);
}

/**
 * Obtiene la fecha del último día hábil
 * Considera fines de semana y feriados
 */
function obtenerUltimoDiaHabil() {
    const fecha = new Date();

    // Ajustar a timezone de Uruguay (UTC-3)
    fecha.setHours(fecha.getHours() - 3);

    let intentos = 0;
    const MAX_INTENTOS = 10; // Máximo retroceder 10 días

    // Buscar el último día hábil
    while (intentos < MAX_INTENTOS) {
        const diaSemana = fecha.getDay(); // 0 = Domingo, 6 = Sábado

        // Si es día de semana (lunes a viernes) y no es feriado
        if (diaSemana >= 1 && diaSemana <= 5 && !esFeriado(fecha)) {
            const fechaStr = fecha.toISOString().split('T')[0];
            console.log(`📅 Último día hábil encontrado: ${fechaStr} (día de semana: ${diaSemana})`);
            return fechaStr;
        }

        // Retroceder un día
        fecha.setDate(fecha.getDate() - 1);
        intentos++;
    }

    // Fallback: si no encontramos un día hábil en 10 días, usar fecha actual
    console.warn('⚠️ No se encontró día hábil reciente, usando fecha actual');
    return new Date().toISOString().split('T')[0];
}

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
    // Buscar el valor TCV en el XML
    const match = xmlString.match(/<TCV>([\d.]+)<\/TCV>/);
    if (!match) {
        console.error('No se encontró TCV en el XML');
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
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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

        // Verificar si hay datos en la respuesta
        if (!xmlText.includes('<TCV>')) {
            console.warn(`⚠️ No hay cotización disponible para ${fecha}, intentando con día anterior`);

            // Intentar con el día anterior
            const fechaAnterior = new Date(fecha);
            fechaAnterior.setDate(fechaAnterior.getDate() - 1);
            const fechaAnteriorStr = fechaAnterior.toISOString().split('T')[0];

            return consultarBCU(fechaAnteriorStr);
        }

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
 * Handler principal de Netlify
 */
exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Método no permitido. Use GET.'
            })
        };
    }

    try {
        console.log('📨 Solicitud recibida para cotización BCU');

        const forzarActualizacion = event.queryStringParameters?.forzar === 'true';

        if (forzarActualizacion || !cacheValido()) {
            console.log('🔄 Actualizando cotización...');

            // Obtener el último día hábil
            const fecha = obtenerUltimoDiaHabil();
            console.log(`📅 Consultando cotización para día hábil: ${fecha}`);

            const valor = await consultarBCU(fecha);

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

        const responseBody = {
            success: true,
            cotizacion: cotizacionCache.valor,
            fecha: cotizacionCache.fecha,
            ultimaActualizacion: cotizacionCache.ultimaActualizacion,
            fuente: cacheValido() ? 'cache' : 'bcu',
            timestamp: new Date().toISOString()
        };

        console.log('✅ Enviando respuesta:', responseBody);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(responseBody)
        };

    } catch (error) {
        console.error('❌ Error en cotizacion-bcu:', error.message);
        console.error('Stack:', error.stack);

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