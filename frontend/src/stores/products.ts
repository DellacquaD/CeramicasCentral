import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface ProductoAPI {
    id: string | number
    nombre: string
    descripcion: string
    marca: string
    categoria: string[]
    subcategoria?: string
    precio?: number
    precioMetro: number
    precioAnterior?: number
    metrosPorCaja: number
    stock: number
    unidad: string
    medidas?: string
    color?: string
    pei?: number
    imagenPrincipal?: string
    disponible: boolean
    activo: boolean
    nuevo?: boolean
    enOferta?: boolean
    slug: string
    tags?: string[]
}

interface CacheInfo {
    edadEnMinutos: number
    ultimaActualizacion: string
}

interface ApiResponse {
    productos: ProductoAPI[]
    cacheInfo: CacheInfo
}

const API_URL = 'https://ceramicascentral.netlify.app/.netlify/functions/products'

export const useProductsStore = defineStore('products', () => {
    // Estado
    const productos = ref<ProductoAPI[]>([])
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)
    const cacheInfo = ref<CacheInfo | null>(null)
    const initialized = ref<boolean>(false)

    // Computed
    const productosActivos = computed(() =>
        productos.value.filter(p => p.disponible && p.activo)
    )

    // Métodos
    const cargarProductos = async (forzar: boolean = false): Promise<void> => {
        // Si ya están cargados y no se fuerza, no hacer nada
        if (initialized.value && !forzar) {
            console.log('✅ Productos ya cargados, usando caché local')
            return
        }

        loading.value = true
        error.value = null

        try {
            console.log('🔄 Cargando productos desde API...')

            const url = forzar ? `${API_URL}?refresh=true` : API_URL

            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            })

            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}: ${response.statusText}`)
            }

            const data: ApiResponse = await response.json()

            if (data.productos) {
                productos.value = data.productos
                cacheInfo.value = data.cacheInfo
                initialized.value = true
                console.log('✅ Productos cargados:', productos.value.length)
            } else {
                throw new Error('Formato de respuesta inesperado')
            }

        } catch (err) {
            console.error('❌ Error al cargar productos:', err)
            error.value = err instanceof Error ? err.message : 'Error desconocido'
        } finally {
            loading.value = false
        }
    }

    const getProductoBySlug = (slug: string): ProductoAPI | undefined => {
        return productos.value.find(p => p.slug === slug)
    }

    const getProductosByCategoria = (categoria: string): ProductoAPI[] => {
        return productosActivos.value.filter(p =>
            Array.isArray(p.categoria) &&
            p.categoria.some(cat => cat.toLowerCase() === categoria.toLowerCase())
        )
    }

    return {
        // Estado
        productos,
        loading,
        error,
        cacheInfo,
        initialized,

        // Computed
        productosActivos,

        // Métodos
        cargarProductos,
        getProductoBySlug,
        getProductosByCategoria
    }
})