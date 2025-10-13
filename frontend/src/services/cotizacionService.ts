// src/services/cotizacionService.ts
// Servicio para manejar la cotización del BCU en Vue

interface CotizacionData {
    valor: number;
    fecha: string;
    ultimaActualizacion: string;
}

interface CotizacionResponse {
    success: boolean;
    cotizacion: number;
    fecha: string;
    ultimaActualizacion: string;
    fuente: string;
}

class CotizacionService {
    private readonly STORAGE_KEY = 'cotizacion_bcu';
    private readonly API_URL = '/.netlify/functions/cotizacion-bcu';
    private cotizacion: CotizacionData | null = null;

    constructor() {
        this.cargarDesdeStorage();
    }

    /**
     * Carga la cotización desde localStorage
     */
    private cargarDesdeStorage(): void {
        try {
            const datos = localStorage.getItem(this.STORAGE_KEY);
            if (datos) {
                this.cotizacion = JSON.parse(datos);
            }
        } catch (error) {
            console.error('Error al cargar cotización del storage:', error);
        }
    }

    /**
     * Guarda la cotización en localStorage
     */
    private guardarEnStorage(cotizacion: CotizacionData): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cotizacion));
            this.cotizacion = cotizacion;
        } catch (error) {
            console.error('Error al guardar cotización:', error);
        }
    }

    /**
     * Verifica si la cotización está actualizada (menos de 24h)
     */
    private cotizacionValida(): boolean {
        if (!this.cotizacion || !this.cotizacion.ultimaActualizacion) {
            return false;
        }

        const horasTranscurridas =
            (Date.now() - new Date(this.cotizacion.ultimaActualizacion).getTime()) / (1000 * 60 * 60);

        return horasTranscurridas < 24;
    }

    /**
     * Obtiene la cotización (desde cache o API)
     */
    async obtener(): Promise<number> {
        // Si la cotización en memoria es válida, usarla
        if (this.cotizacionValida()) {
            console.log('💵 Usando cotización del cache:', this.cotizacion!.valor);
            return this.cotizacion!.valor;
        }

        // Consultar a la Netlify Function
        try {
            console.log('🔄 Consultando cotización a Netlify Function...');

            const response = await fetch(this.API_URL);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data: CotizacionResponse = await response.json();

            if (data.success) {
                const cotizacion: CotizacionData = {
                    valor: data.cotizacion,
                    fecha: data.fecha,
                    ultimaActualizacion: data.ultimaActualizacion
                };

                this.guardarEnStorage(cotizacion);
                console.log('✅ Cotización actualizada:', cotizacion.valor);

                return cotizacion.valor;
            } else {
                throw new Error('Error en la respuesta del servidor');
            }

        } catch (error) {
            console.error('❌ Error al obtener cotización:', error);

            // Si hay un valor en cache (aunque esté vencido), usarlo
            if (this.cotizacion && this.cotizacion.valor) {
                console.log('⚠️ Usando cotización antigua del cache');
                return this.cotizacion.valor;
            }

            // Valor por defecto de emergencia
            console.log('⚠️ Usando cotización por defecto: 42');
            return 42;
        }
    }

    /**
     * Convierte precio USD a UYU
     */
    async convertirAPesos(precioUSD: number): Promise<number> {
        const cotizacion = await this.obtener();
        return precioUSD * cotizacion;
    }

    /**
     * Obtiene información completa de la cotización
     */
    getInfo(): CotizacionData | null {
        return this.cotizacion;
    }

    /**
     * Fuerza la actualización de la cotización
     */
    async forzarActualizacion(): Promise<number> {
        try {
            const response = await fetch(`${this.API_URL}?forzar=true`);
            const data: CotizacionResponse = await response.json();

            if (data.success) {
                const cotizacion: CotizacionData = {
                    valor: data.cotizacion,
                    fecha: data.fecha,
                    ultimaActualizacion: data.ultimaActualizacion
                };

                this.guardarEnStorage(cotizacion);
                return cotizacion.valor;
            }

            throw new Error('Error al forzar actualización');
        } catch (error) {
            console.error('Error al forzar actualización:', error);
            throw error;
        }
    }
}

// Exportar instancia única
export const cotizacionService = new CotizacionService();

// Composable para usar en componentes Vue
export function useCotizacion() {
    return {
        obtenerCotizacion: () => cotizacionService.obtener(),
        convertirAPesos: (precioUSD: number) => cotizacionService.convertirAPesos(precioUSD),
        getInfo: () => cotizacionService.getInfo(),
        forzarActualizacion: () => cotizacionService.forzarActualizacion()
    };
}

// Export default para importación flexible
export default cotizacionService;