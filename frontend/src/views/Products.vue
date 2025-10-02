<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
        <button @click="cargarProductos(true)" class="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline">
          Reintentar
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
              @click="goToProduct(product)"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
          >
            <div class="relative">
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
                  Stock: {{ product.stock.toFixed(2) }} {{ product.unidad }}
                </span>
              </div>
            </div>

            <div class="p-4">
              <p class="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">{{ product.marca }}</p>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem]">{{ product.nombre }}</h3>

              <div class="flex items-center gap-2 mb-3 text-xs text-gray-600 dark:text-gray-400">
                <span v-if="product.medidas" class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{{ product.medidas }}</span>
                <span v-if="product.color" class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{{ product.color }}</span>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <span v-if="product.precioAnterior > 0" class="text-sm text-gray-500 line-through mr-2">
                    ${{ product.precioAnterior.toLocaleString('es-UY') }}
                  </span>
                  <div class="flex flex-col">
                    <span class="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ${{ product.precio.toLocaleString('es-UY', { minimumFractionDigits: 2 }) }}
                    </span>
                    <span v-if="product.precioMetro" class="text-xs text-gray-500">
                      ${{ product.precioMetro.toFixed(2) }}/m²
                    </span>
                  </div>
                </div>

                <div v-if="product.pei" class="text-xs">
                  <span class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded font-semibold">
                    PEI {{ product.pei }}
                  </span>
                </div>
              </div>

              <div v-if="product.metrosPorCaja" class="mt-2 text-xs text-gray-500">
                📦 {{ product.metrosPorCaja }} m²/caja
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

interface Producto {
  id: string
  sku: string
  nombre: string
  descripcion: string
  marca: string
  categoria: string
  subcategoria: string
  precio: number
  precioAnterior: number
  moneda: string
  stock: number
  unidad: string
  disponible: boolean
  color: string
  material: string
  medidas: string
  metrosPorCaja: number
  precioMetro: number
  pei: string
  imagenPrincipal: string
  imagenesSecundarias: string
  activo: boolean
  destacado: boolean
  nuevo: boolean
  enOferta: boolean
  slug: string
  fechaCreacion: string
  fechaActualizacion: string
}

const router = useRouter()
const props = defineProps<{ categorySlug?: string }>()

const productos = ref<Producto[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const cacheInfo = ref<any>(null)
const searchTerm = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = 12

const cargarProductos = async (forzar = false) => {
  try {
    loading.value = true
    error.value = null
    const url = forzar ? '/.netlify/functions/products?refresh=true' : '/.netlify/functions/products'
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Error ${response.status}`)
    const data = await response.json()
    productos.value = data.productos || []
    cacheInfo.value = data.cacheInfo
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error cargando productos'
  } finally {
    loading.value = false
  }
}

const productosFiltradosPorCategoria = computed(() => {
  if (props.categorySlug) {
    return productos.value.filter(p => p.categoria.toLowerCase() === props.categorySlug?.toLowerCase() && p.disponible && p.activo)
  }
  return productos.value.filter(p => p.disponible && p.activo)
})

const productosFiltrados = computed(() => {
  let result = productosFiltradosPorCategoria.value
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(p => p.nombre.toLowerCase().includes(term) || p.descripcion.toLowerCase().includes(term) || p.marca.toLowerCase().includes(term))
  }
  switch (sortBy.value) {
    case 'price-low': result = [...result].sort((a, b) => a.precio - b.precio); break
    case 'price-high': result = [...result].sort((a, b) => b.precio - a.precio); break
    case 'stock': result = [...result].sort((a, b) => b.stock - a.stock); break
    default: result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre))
  }
  return result
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return productosFiltrados.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(productosFiltrados.value.length / itemsPerPage))

const displayPages = computed(() => {
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

const pageTitle = computed(() => {
  if (props.categorySlug) {
    const names: Record<string, string> = { pisos: 'Pisos', revestimientos: 'Revestimientos', cocina: 'Cocina', griferia: 'Grifería', bano: 'Baño' }
    return names[props.categorySlug.toLowerCase()] || 'Productos'
  }
  return 'Todos los Productos'
})

const goToProduct = (product: Producto) => router.push(`/producto/${product.slug}`)

watch(() => props.categorySlug, () => { currentPage.value = 1; searchTerm.value = '' })
watch(searchTerm, () => currentPage.value = 1)

onMounted(() => cargarProductos())
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>