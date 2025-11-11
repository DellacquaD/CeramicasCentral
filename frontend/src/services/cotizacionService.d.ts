interface CotizacionData {
    valor: number;
    fecha: string;
    ultimaActualizacion: string;
}
declare class CotizacionService {
    private readonly STORAGE_KEY;
    private readonly API_URL;
    private cotizacion;
    constructor();
    /**
     * Carga la cotización desde localStorage
     */
    private cargarDesdeStorage;
    /**
     * Guarda la cotización en localStorage
     */
    private guardarEnStorage;
    /**
     * Verifica si la cotización está actualizada (menos de 24h)
     */
    private cotizacionValida;
    /**
     * Obtiene la cotización (desde cache o API)
     */
    obtener(): Promise<number>;
    /**
     * Convierte precio USD a UYU
     */
    convertirAPesos(precioUSD: number): Promise<number>;
    /**
     * Obtiene información completa de la cotización
     */
    getInfo(): CotizacionData | null;
    /**
     * Fuerza la actualización de la cotización
     */
    forzarActualizacion(): Promise<number>;
}
export declare const cotizacionService: CotizacionService;
export declare function useCotizacion(): {
    obtenerCotizacion: () => Promise<number>;
    convertirAPesos: (precioUSD: number) => Promise<number>;
    getInfo: () => CotizacionData | null;
    forzarActualizacion: () => Promise<number>;
};
export default cotizacionService;
