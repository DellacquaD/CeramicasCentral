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
              <div class="flex items-center gap-4">
                <p class="text-gray-600 dark:text-gray-400">
                  {{ productosFiltrados.length }} productos
                </p>
              </div>
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
                  <span v-if="product.precioAnterior && product.precioAnterior > 0"
                        class="text-sm text-gray-500 line-through mr-2">
                    ${{ formatearPrecio(product.precioAnterior * product.precioUYU / product.precio) }}
                  </span>

                  <div class="flex items-center justify-between mx-3">
                    <div class="flex flex-col">
                      <div class="flex items-baseline gap-1">
                        <span class="text-lg font-bold text-blue-600 dark:text-blue-400">
                          ${{ formatearPrecio(product.precioUYU) }}
                        </span>
                        <span class="text-sm text-gray-500">caja</span>
                      </div>

                      <span v-if="product.precioMetro" class="text-sm text-gray-500">
                        ${{ formatearPrecio(product.precioMetroUYU) }} m²
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
import { useCartStore } from '@/stores/cart'
import { useProducts } from '@/composables/useProducts'
import { useCotizacion } from '@/services/cotizacionService'
import type {ProductoAPI, ProductoAPIUYU} from '@/stores/products'

// Interfaz extendida con precios en UYU
interface ProductoConPrecioUYU extends ProductoAPI {
  precioUYU: number
  precioMetroUYU: number
}

// Props
interface Props {
  categorySlug?: string
}

const props = defineProps<Props>()

// Router y Stores
const router = useRouter()
const cartStore = useCartStore()

// Usar el composable
const { store, productos, loading, error, cargarSiEsNecesario } = useProducts()

// Cotización
const cotizacionUSD = ref<number>(42)
const { obtenerCotizacion } = useCotizacion()

// State
const searchTerm = ref<string>('')
const sortBy = ref<string>('name')
const currentPage = ref<number>(1)
const itemsPerPage = 12

// Methods

const cargarCotizacion = async (): Promise<void> => {
  try {
    const valor = await obtenerCotizacion()
    cotizacionUSD.value = valor
    console.log('✅ Cotización cargada:', valor)
  } catch (error) {
    console.error('❌ Error al cargar cotización:', error)
  }
}

const addToCart = (product: ProductoConPrecioUYU): void => {
  cartStore.addItem(product)
}

const formatearPrecio = (precio: number): string => {
  return Math.round(precio).toLocaleString('es-UY')
}

const goToProduct = (product: ProductoAPI): void => {
  console.log('Navegando a producto:', product.nombre, 'con slug:', product.slug)
  if (!product.slug) {
    console.error('El producto no tiene slug:', product)
    return
  }
  router.push(`/product/${product.slug}`)
}

// Computed
const productosFiltradosPorCategoria = computed((): ProductoAPIUYU[] => {
  if (props.categorySlug) {
    return store.getProductosByCategoriaConUYU(props.categorySlug)
  }
  return productos.value
})

const productosFiltrados = computed((): ProductoAPIUYU[] => {
  let result = productosFiltradosPorCategoria.value

  // Búsqueda por término
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase().trim()

    result = result.filter(p => {
      const nombre = p.nombre?.toLowerCase() || ''
      const marca = p.marca?.toLowerCase() || ''
      const categorias = Array.isArray(p.categoria) ? p.categoria.map(c => c.toLowerCase()) : []
      const tags = Array.isArray(p.tags) ? p.tags.map(t => t.toLowerCase()) : []

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
      result = [...result].sort((a, b) => a.precioPorCajaUYU - b.precioPorCajaUYU)
      break
    case 'price-high':
      result = [...result].sort((a, b) => b.precioPorCajaUYU - a.precioPorCajaUYU)
      break
    default:
      result = [...result].sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''))
  }

  return result
})

const paginatedProducts = computed((): ProductoAPIUYU[] => {
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
    const categoria = store.categories.find(c =>
        c.slug.toLowerCase() === props.categorySlug?.toLowerCase()
    )

    if (categoria) {
      return categoria.name
    }

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

// Watchers
watch(() => props.categorySlug, () => {
  currentPage.value = 1
  searchTerm.value = ''
})

watch(searchTerm, () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(async () => {
  // Cargar productos si es necesario
  await cargarSiEsNecesario()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
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