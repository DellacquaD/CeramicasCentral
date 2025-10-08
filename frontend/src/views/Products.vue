<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">Cargando productos...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="text-red-600 dark:text-red-400 mb-4">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <p class="text-xl font-semibold">Error al cargar productos</p>
          <p class="text-gray-600 dark:text-gray-400 mt-2">{{ error }}</p>
        </div>
        <button
            @click="cargarProductos(true)"
            class="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>Reintentar</span>
        </button>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Header -->
        <div class="mb-8">
          <nav class="flex mb-4" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-2">
              <li>
                <router-link to="/" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  Inicio
                </router-link>
              </li>
              <ChevronRightIcon class="w-4 h-4 text-gray-400" />
              <li class="text-gray-900 dark:text-white font-medium">
                {{ pageTitle }}
              </li>
            </ol>
          </nav>

          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {{ pageTitle }}
              </h1>
              <p class="text-gray-600 dark:text-gray-400">
                {{ productosFiltrados.length }} productos encontrados
              </p>
            </div>

            <!-- Cache Info -->
            <div v-if="cacheInfo" class="text-xs text-gray-500 dark:text-gray-400 text-right">
              <p>Actualizado hace {{ cacheInfo.edadEnMinutos || 0 }} min</p>
              <button @click="cargarProductos(true)" class="text-blue-600 dark:text-blue-400 hover:underline">
                Refrescar
              </button>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-4 mb-8">
          <div class="flex-1">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                  v-model="searchTerm"
                  type="text"
                  placeholder="Buscar productos..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <select v-model="sortBy" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            <option value="name">Ordenar por nombre</option>
            <option value="price-low">Precio menor a mayor</option>
            <option value="price-high">Precio mayor a menor</option>
            <option value="stock">Mayor stock</option>
          </select>
        </div>

        <!-- No products -->
        <div v-if="productosFiltrados.length === 0" class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400 text-lg">No se encontraron productos</p>
        </div>

        <!-- Products grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div
              v-for="product in paginatedProducts"
              :key="product.id"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
          >
            <!-- Imagen clickeable -->
            <div
                @click="goToProduct(product)"
                class="relative cursor-pointer"
            >
              <div class="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <img
                    v-if="product.imagenPrincipal"
                    :src="product.imagenPrincipal"
                    :alt="product.nombre"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div v-else class="text-center p-4">
                  <div class="text-4xl mb-2">📦</div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ product.marca }}</p>
                </div>
              </div>

              <div class="absolute top-2 left-2 flex flex-col gap-1">
                <span v-if="product.nuevo" class="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold">NUEVO</span>
                <span v-if="product.enOferta" class="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">OFERTA</span>
              </div>

              <div class="absolute bottom-2 right-2">
                <span :class="['px-2 py-1 rounded-md text-xs font-semibold', product.stock > 50 ? 'bg-green-100 text-green-800' : product.stock > 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800']">
                  Stock: {{ parseInt(product.stock.toFixed(2)) }} {{ product.unidad }}
                </span>
              </div>
            </div>

            <!-- Información del producto -->
            <div class="p-4 flex flex-col flex-grow">
              <div @click="goToProduct(product)" class="cursor-pointer flex-grow">
                <p class="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">{{ product.marca }}</p>
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem]">{{ product.nombre }}</h3>

                <div class="flex items-center gap-2 mb-3 text-xs text-gray-600 dark:text-gray-400">
                  <span v-if="product.medidas" class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{{ product.medidas }}</span>
                  <span v-if="product.color" class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{{ product.color }}</span>
                </div>

                <div class="mb-3">
                  <span v-if="product.precioAnterior && product.precioAnterior > 0" class="text-sm text-gray-500 line-through mr-2">
                    ${{ product.precioAnterior?.toLocaleString('es-UY') }}
                  </span>
                  <div class="flex items-center justify-between mx-3 ">
                    <div class="flex flex-col">
                      <span class="text-lg font-bold text-blue-600 dark:text-blue-400">
                        ${{ (product.precioMetro * product.metrosPorCaja).toFixed(0) }}
                      </span>
                      <span v-if="product.precioMetro" class="text-xs text-gray-500">
                        ${{ parseInt(product.precioMetro.toFixed(2)) }}/m²
                      </span>
                    </div>
                    <button
                        @click.stop="addToCart(product)"
                        class="mt-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg group"
                    >
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 group-hover:scale-110 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                      >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div v-if="product.metrosPorCaja" class="text-xs text-gray-500">
                  📦 {{ product.metrosPorCaja }} m²/caja
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center">
          <nav class="flex items-center space-x-2">
            <button
                @click="currentPage > 1 && (currentPage--)"
                :disabled="currentPage <= 1"
                class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Anterior
            </button>

            <span
                v-for="page in displayPages"
                :key="page"
                @click="typeof page === 'number' && (currentPage = page)"
                :class="['px-3 py-2 rounded-lg transition-colors', page === currentPage ? 'bg-blue-600 text-white' : typeof page === 'number' ? 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer' : 'text-gray-500']"
            >
              {{ page }}
            </span>

            <button
                @click="currentPage < totalPages && (currentPage++)"
                :disabled="currentPage >= totalPages"
                class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Siguiente
            </button>
          </nav>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'

// Interfaces
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

// Props
interface Props {
  categorySlug?: string
}

const props = defineProps<Props>()

// Router y Store
const router = useRouter()
const cartStore = useCartStore()

// State
const productos = ref<ProductoAPI[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const cacheInfo = ref<CacheInfo | null>(null)
const searchTerm = ref<string>('')
const sortBy = ref<string>('name')
const currentPage = ref<number>(1)
const itemsPerPage = 12

// API URL
const API_URL = 'https://ceramicascentral.netlify.app/.netlify/functions/products'

// Methods
const cargarProductos = async (forzar: boolean = false): Promise<void> => {
  loading.value = true
  error.value = null

  try {
    console.log('Intentando fetch a:', API_URL)

    const url = forzar ? `${API_URL}?refresh=true` : API_URL

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    })

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`)
    }

    const data: ApiResponse = await response.json()
    console.log('Data recibida:', data)

    if (data.productos) {
      productos.value = data.productos
      cacheInfo.value = data.cacheInfo
      console.log('Productos cargados:', productos.value.length)
    } else {
      throw new Error('Formato de respuesta inesperado - no se encontró "productos"')
    }

  } catch (err) {
    console.error('Error al cargar productos:', err)
    error.value = err instanceof Error ? err.message : 'Error desconocido al cargar productos'
  } finally {
    loading.value = false
  }
}

const addToCart = (product: ProductoAPI): void => {
  cartStore.addItem(product)
}

// Computed
const productosFiltradosPorCategoria = computed((): ProductoAPI[] => {
  if (props.categorySlug) {
    return productos.value.filter(p =>
        Array.isArray(p.categoria) &&
        p.categoria.some(cat => cat.toLowerCase() === props.categorySlug!.toLowerCase()) &&
        p.disponible &&
        p.activo
    )
  }
  return productos.value.filter(p => p.disponible && p.activo)
})

const productosFiltrados = computed((): ProductoAPI[] => {
  let result = productosFiltradosPorCategoria.value

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase().trim()

    result = result.filter(p => {
      const nombre = p.nombre?.toLowerCase() || ''
      const marca = p.marca?.toLowerCase() || ''

      const categorias = Array.isArray(p.categoria)
          ? p.categoria.map(c => c.toLowerCase())
          : []

      const tags = Array.isArray(p.tags)
          ? p.tags.map(t => t.toLowerCase())
          : []

      return (
          nombre.includes(term) ||
          marca.includes(term) ||
          categorias.some(cat => cat.includes(term)) ||
          tags.some(tag => tag.includes(term))
      )
    })
  }

  // Ordenamiento
  switch (sortBy.value) {
    case 'price-low':
      result = [...result].sort((a, b) => (a.precio || 0) - (b.precio || 0))
      break
    case 'price-high':
      result = [...result].sort((a, b) => (b.precio || 0) - (a.precio || 0))
      break
    case 'stock':
      result = [...result].sort((a, b) => b.stock - a.stock)
      break
    default:
      result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre))
  }

  return result
})


// const productosFiltrados = computed((): ProductoAPI[] => {
//   let result = productosFiltradosPorCategoria.value
//
//   if (searchTerm.value) {
//     const term = searchTerm.value.toLowerCase()
//     result = result.filter(p =>
//         p.nombre.toLowerCase().includes(term) ||
//         p.descripcion.toLowerCase().includes(term) ||
//         p.marca.toLowerCase().includes(term) ||
//         (Array.isArray(p.tags) && p.tags.some(tag => tag.toLowerCase().includes(term)))
//     )
//   }
//
//   switch (sortBy.value) {
//     case 'price-low':
//       result = [...result].sort((a, b) => (a.precio || 0) - (b.precio || 0))
//       break
//     case 'price-high':
//       result = [...result].sort((a, b) => (b.precio || 0) - (a.precio || 0))
//       break
//     case 'stock':
//       result = [...result].sort((a, b) => b.stock - a.stock)
//       break
//     default:
//       result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre))
//   }
//
//   return result
// })

const paginatedProducts = computed((): ProductoAPI[] => {
  const start = (currentPage.value - 1) * itemsPerPage
  return productosFiltrados.value.slice(start, start + itemsPerPage)
})

const totalPages = computed((): number => {
  return Math.ceil(productosFiltrados.value.length / itemsPerPage)
})

const displayPages = computed((): (number | string)[] => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

const pageTitle = computed((): string => {
  if (props.categorySlug) {
    const names: Record<string, string> = {
      pisos: 'Pisos',
      revestimientos: 'Revestimientos',
      cocina: 'Cocina',
      griferia: 'Grifería',
      bano: 'Baño'
    }
    return names[props.categorySlug.toLowerCase()] || 'Productos'
  }
  return 'Todos los Productos'
})

const goToProduct = (product: ProductoAPI): void => {
  console.log('Navegando a producto:', product.nombre, 'con slug:', product.slug)
  if (!product.slug) {
    console.error('El producto no tiene slug:', product)
    return
  }
  router.push(`/producto/${product.slug}`)
}

// Watchers
watch(() => props.categorySlug, () => {
  currentPage.value = 1
  searchTerm.value = ''
})

watch(searchTerm, () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  cargarProductos()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>