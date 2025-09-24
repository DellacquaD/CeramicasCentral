import type { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent, 
  context: Context
) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Solo se permite método POST' })
    };
  }

  try {
    const jsonData = JSON.parse(event.body || '{}');
    
    // Aquí podrías hacer el forward a get-categorias
    // O simplemente validar y responder
    
    console.log('✅ Update recibido:', new Date().toISOString());
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Datos recibidos correctamente',
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: (error as Error).message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
