/**
 * Composables y utilidades para trabajar con productos
 */

import { computed, type ComputedRef } from 'vue'
import { useProductsStore } from '../stores/products'
import type { ProductoCompleto, ProductoAPI } from '../stores/products'

/**
 * Composable para gestionar productos con loading automático
 */
export function useProducts() {
    const store = useProductsStore()

    const cargarSiEsNecesario = async () => {
        if (!store.initialized) {
            await Promise.all([
                store.cargarProductos(),
                store.cargarCotizacion()
            ])
        }
    }

    return {
        store,
        productos: computed(() => store.productosActivosEnUYU),
        categorias: computed(() => store.categories),
        loading: computed(() => store.loading),
        cotizacion: computed(() => store.cotizacionUSD),
        error: computed(() => store.error),
        cargarSiEsNecesario,
        cargar: store.cargarProductos
    }
}

/**
 * Composable para un producto individual
 */
export function useProducto(slug: ComputedRef<string> | string) {
    const store = useProductsStore()

    const producto = computed(() =>
        store.getProductoBySlug(typeof slug === 'string' ? slug : slug.value)
    )

    const productoFormateado = computed(() => {
        const slugValue = typeof slug === 'string' ? slug : slug.value
        return store.getProductoBySlugConUYU(slugValue)
    })

    const cargarSiEsNecesario = async () => {
        if (!store.initialized) {
            await Promise.all([
                store.cargarProductos(),
                store.cargarCotizacion()
            ])
        }
    }

    return {
        producto, // ProductoCompleto (formato BD)
        productoFormateado, // ProductoAPIConUYU (con precios en UYU)
        loading: computed(() => store.loading),
        error: computed(() => store.error),
        cargarSiEsNecesario
    }
}

/**
 * Composable para productos por categoría
 */
export function useCategoria(categoria: ComputedRef<string> | string) {
    const store = useProductsStore()

    const productos = computed(() => {
        const cat = typeof categoria === 'string' ? categoria : categoria.value
        return store.getProductosByCategoria(cat)
    })

    const categoriaInfo = computed(() => {
        const cat = typeof categoria === 'string' ? categoria : categoria.value
        return store.categories.find(c =>
            c.slug.toLowerCase() === cat.toLowerCase() ||
            c.name.toLowerCase() === cat.toLowerCase()
        )
    })

    return {
        productos,
        categoriaInfo,
        loading: computed(() => store.loading),
        error: computed(() => store.error)
    }
}

/**
 * Utilidad para formatear precios
 */
export function formatearPrecio(precio: number, moneda: string = 'UYU'): string {
    const simbolos: Record<string, string> = {
        UYU: '$',
        USD: 'US$',
        EUR: '€'
    }

    const simbolo = simbolos[moneda] || moneda
    return `${simbolo} ${precio.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Utilidad para calcular descuento
 */
export function calcularDescuento(precioActual: number, precioAnterior: number | null): number {
    if (!precioAnterior || precioAnterior <= precioActual) return 0
    return Math.round(((precioAnterior - precioActual) / precioAnterior) * 100)
}

/**
 * Utilidad para obtener la URL de la imagen principal
 */
export function obtenerImagenPrincipal(producto: ProductoCompleto | ProductoAPI): string {
    if ('imagenPrincipal' in producto && producto.imagenPrincipal) {
        return producto.imagenPrincipal
    }
    if ('images' in producto && Array.isArray(producto.images) && producto.images.length > 0) {
        const principal = producto.images.find(img => img.is_primary)
        return principal?.url || producto.images[0]?.url || ''
    }
    return '/images/placeholder.jpg' // Imagen por defecto
}

/**
 * Utilidad para filtrar productos por rango de precio
 */
export function filtrarPorPrecio(
    productos: ProductoCompleto[],
    precioMin?: number,
    precioMax?: number
): ProductoCompleto[] {
    return productos.filter(p => {
        if (precioMin !== undefined && p.price < precioMin) return false
        if (precioMax !== undefined && p.price > precioMax) return false
        return true
    })
}

/**
 * Utilidad para ordenar productos
 */
export type OrdenProductos = 'precio-asc' | 'precio-desc' | 'nombre-asc' | 'nombre-desc' | 'nuevo' | 'destacado'

export function ordenarProductos(
    productos: ProductoCompleto[],
    orden: OrdenProductos
): ProductoCompleto[] {
    const copia = [...productos]

    switch (orden) {
        case 'precio-asc':
            return copia.sort((a, b) => a.price - b.price)
        case 'precio-desc':
            return copia.sort((a, b) => b.price - a.price)
        case 'nombre-asc':
            return copia.sort((a, b) => a.name.localeCompare(b.name, 'es'))
        case 'nombre-desc':
            return copia.sort((a, b) => b.name.localeCompare(a.name, 'es'))
        case 'nuevo':
            return copia.sort((a, b) => {
                if (a.nuevo && !b.nuevo) return -1
                if (!a.nuevo && b.nuevo) return 1
                return 0
            })
        case 'destacado':
            return copia.sort((a, b) => {
                if (a.destacado && !b.destacado) return -1
                if (!a.destacado && b.destacado) return 1
                return 0
            })
        default:
            return copia
    }
}

/**
 * Utilidad para agrupar productos por categoría
 */
export function agruparPorCategoria(productos: ProductoCompleto[]): Map<string, ProductoCompleto[]> {
    const grupos = new Map<string, ProductoCompleto[]>()

    productos.forEach(producto => {
        producto.categories.forEach(categoria => {
            if (!grupos.has(categoria.name)) {
                grupos.set(categoria.name, [])
            }
            grupos.get(categoria.name)!.push(producto)
        })
    })

    return grupos
}

/**
 * Utilidad para agrupar productos por marca
 */
export function agruparPorMarca(productos: ProductoCompleto[]): Map<string, ProductoCompleto[]> {
    const grupos = new Map<string, ProductoCompleto[]>()

    productos.forEach(producto => {
        const marca = producto.brand?.name || 'Sin marca'
        if (!grupos.has(marca)) {
            grupos.set(marca, [])
        }
        grupos.get(marca)!.push(producto)
    })

    return grupos
}

/**
 * Utilidad para obtener productos relacionados
 * (mismo material, misma categoría o mismo color)
 */
export function obtenerProductosRelacionados(
    producto: ProductoCompleto,
    todosLosProductos: ProductoCompleto[],
    limite: number = 4
): ProductoCompleto[] {
    const relacionados = todosLosProductos.filter(p => {
        // No incluir el mismo producto
        if (p.id === producto.id) return false

        // Verificar si comparten material
        if (producto.material_id && p.material_id === producto.material_id) return true

        // Verificar si comparten alguna categoría
        if (producto.categories.some(cat =>
            p.categories.some(pCat => pCat.id === cat.id)
        )) return true

        // Verificar si comparten color
        if (producto.color_id && p.color_id === producto.color_id) return true

        return false
    })

    // Limitar el número de resultados
    return relacionados.slice(0, limite)
}

/**
 * Utilidad para generar breadcrumbs
 */
export interface Breadcrumb {
    label: string
    url: string
}

// export function generarBreadcrumbs(producto: ProductoCompleto): Breadcrumb[] {
//     const breadcrumbs: Breadcrumb[] = [
//         { label: 'Inicio', url: '/' }
//     ]
//
//     // Agregar categoría principal
//     if (producto.categories.length > 0) {
//         const categoria = producto.categories[0]
//         breadcrumbs.push({
//             label: categoria?.name || 'string',
//             url: `/categoria/${categoria.slug}`
//         })
//
//         // Agregar subcategoría si existe
//         if (producto.subcategories.length > 0) {
//             const subcategoria = producto.subcategories[0]
//             breadcrumbs.push({
//                 label: subcategoria.name,
//                 url: `/categoria/${categoria.slug}/${subcategoria.slug}`
//             })
//         }
//     }
//
//     // Agregar el producto actual
//     breadcrumbs.push({
//         label: producto.nombre,
//         url: `/producto/${producto.slug}`
//     })
//
//     return breadcrumbs
// }

/**
 * Utilidad para validar disponibilidad de stock
 */
export function verificarDisponibilidad(
    producto: ProductoCompleto,
    cantidadSolicitada: number = 1
): {
    disponible: boolean
    mensaje: string
} {
    if (!producto.disponible || !producto.activo) {
        return {
            disponible: false,
            mensaje: 'Producto no disponible'
        }
    }

    if (producto.stock === null) {
        return {
            disponible: true,
            mensaje: 'Disponible'
        }
    }

    if (producto.stock < cantidadSolicitada) {
        return {
            disponible: false,
            mensaje: `Solo hay ${producto.stock} unidades disponibles`
        }
    }

    return {
        disponible: true,
        mensaje: `${producto.stock} unidades en stock`
    }
}

/**
 * Utilidad para obtener el texto SEO de un producto
 */
export function generarMetaSEO(producto: ProductoCompleto): {
    title: string
    description: string
    keywords: string[]
} {
    const marca = producto.brand?.name || ''
    const categorias = producto.categories.map(c => c.name).join(', ')
    const tags = producto.tags.map(t => t.name)

    return {
        title: `${producto.name} - ${marca} | Cerámicas Central`,
        description: producto.description ||
            `${producto.name} de ${marca}. ${categorias}. Disponible en Cerámicas Central.`,
        keywords: [
            producto.name,
            marca,
            ...producto.categories.map(c => c.name),
            ...tags,
            producto.color?.name || '',
            producto.material?.name || ''
        ].filter(Boolean)
    }
}