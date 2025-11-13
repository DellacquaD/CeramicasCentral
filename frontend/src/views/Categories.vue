<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Quick Navigation Tabs (común para ambas vistas) -->
    <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="transform -translate-y-full opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-full opacity-0"
    >
      <div v-if="selectedCategorySlug" class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex overflow-x-auto py-4 gap-3 scrollbar-hide">
            <!-- Botón "Todas" -->
            <button
                @click="selectCategory(null)"
                class="flex-shrink-0 px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <span class="flex items-center gap-2">
                <span>📋</span>
                Todas las categorías
              </span>
            </button>

            <!-- Botones de categorías -->
            <button
                v-for="category in categoriesWithProducts"
                :key="category.id"
                @click="selectCategory(category.slug)"
                :class="[
                  'flex-shrink-0 px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap',
                  selectedCategorySlug === category.slug
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                ]"
            >
              <span class="flex items-center gap-2">
                <span>{{ getCategoryIcon(category.name) }}</span>
                {{ category.name }}
                <span class="text-xs opacity-75">({{ category.productCount }})</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Contenido Principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">Cargando...</span>
      </div>

      <template v-else>
        <!-- ============================================ -->
        <!-- VISTA 1: Grid de Categorías -->
        <!-- ============================================ -->
        <template v-if="!selectedCategorySlug">
          <!-- Search bar -->
          <div class="mb-8 max-w-md mx-auto">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                  v-model="searchTerm"
                  type="text"
                  placeholder="Buscar categorías..."
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          <!-- Categories grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            <div
                v-for="category in filteredCategories"
                :key="category.id"
                @click="selectCategory(category.slug)"
                class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group"
            >
              <div class="relative h-56 overflow-hidden">
                <img
                    v-if="category.image_url"
                    :src="category.image_url"
                    :alt="category.name"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span class="text-7xl group-hover:scale-110 transition-transform duration-300">
                    {{ getCategoryIcon(category.name) }}
                  </span>
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div class="absolute bottom-4 left-4 right-4">
                  <h3 class="text-xl font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">
                    {{ category.name }}
                  </h3>
                  <p class="text-gray-200 text-sm flex items-center gap-1">
                    <span>📦</span>
                    {{ category.productCount }} productos
                  </p>
                </div>
              </div>
              <div class="p-4 bg-gradient-to-r from-blue-50 to-white dark:from-gray-700 dark:to-gray-800">
                <div class="flex items-center justify-between">
                  <span class="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    Explorar productos
                  </span>
                  <ArrowRightIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state para categorías -->
          <div v-if="filteredCategories.length === 0" class="text-center py-12">
            <div class="text-gray-400 dark:text-gray-500 mb-4">
              <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-lg">
              No se encontraron categorías que coincidan con tu búsqueda
            </p>
          </div>

          <!-- Stats section -->
          <div class="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md">
            <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Nuestro Catálogo
              </h2>
              <p class="text-gray-600 dark:text-gray-400">
                Números que respaldan nuestra experiencia
              </p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div class="text-center p-4 rounded-xl bg-blue-50 dark:bg-gray-700">
                <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {{ totalProducts }}+
                </div>
                <div class="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Productos
                </div>
              </div>
              <div class="text-center p-4 rounded-xl bg-blue-50 dark:bg-gray-700">
                <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {{ categoriesWithProducts.length }}
                </div>
                <div class="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Categorías
                </div>
              </div>
              <div class="text-center p-4 rounded-xl bg-blue-50 dark:bg-gray-700">
                <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {{ totalBrands }}
                </div>
                <div class="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Marcas
                </div>
              </div>
              <div class="text-center p-4 rounded-xl bg-blue-50 dark:bg-gray-700">
                <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  15
                </div>
                <div class="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Años experiencia
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ============================================ -->
        <!-- VISTA 2: Grid de Productos por Categoría -->
        <!-- ============================================ -->
        <template v-else>
          <!-- Filters Bar -->
          <div class="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <!-- Search -->
            <div class="flex-1 w-full sm:max-w-md">
              <div class="relative">
                <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    v-model="productSearchTerm"
                    type="text"
                    placeholder="Buscar productos..."
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
            </div>

            <!-- Sort and Results count -->
            <div class="flex items-center gap-4">
              <span class="text-gray-600 dark:text-gray-400 text-sm font-medium">
                {{ filteredProducts.length }} productos encontrados
              </span>
              <select
                  v-model="sortBy"
                  class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="name">Nombre A-Z</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
                <option value="newest">Más nuevos</option>
                <option value="stock">Mayor stock</option>
              </select>
            </div>
          </div>

          <!-- No products -->
          <div v-if="filteredProducts.length === 0" class="text-center py-16">
            <div class="text-gray-400 dark:text-gray-500 mb-4">
              <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No se encontraron productos
            </p>
            <p class="text-gray-400 dark:text-gray-500 text-sm">
              Intenta con otra búsqueda o explora otras categorías
            </p>
          </div>

          <!-- Products Grid (mismo estilo que categorías) -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            <div
                v-for="product in paginatedProducts"
                :key="product.id"
                class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <!-- Imagen -->
              <div
                  @click="goToProduct(product)"
                  class="relative cursor-pointer overflow-hidden h-56"
              >
                <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                  <img
                      v-if="product.imagenPrincipal"
                      :src="product.imagenPrincipal"
                      :alt="product.nombre"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <div class="text-center p-4">
                      <div class="text-6xl mb-2">📦</div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ product.marca }}</p>
                    </div>
                  </div>
                </div>

                <!-- Badges -->
                <div class="absolute top-3 left-3 flex flex-col gap-2">
                  <span v-if="product.nuevo" class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    NUEVO
                  </span>
                  <span v-if="product.enOferta" class="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    OFERTA
                  </span>
                </div>

                <!-- Stock badge -->
                <div v-if="product.stock !== null" class="absolute bottom-3 right-3">
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm',
                    product.stock > 50 ? 'bg-green-500/90 text-white' :
                    product.stock > 10 ? 'bg-yellow-500/90 text-white' :
                    'bg-red-500/90 text-white'
                  ]">
                    Stock: {{ parseInt(product.stock.toFixed(0)) }}
                  </span>
                </div>
              </div>

              <!-- Info del producto -->
              <div class="p-5 flex flex-col flex-grow">
                <div @click="goToProduct(product)" class="cursor-pointer flex-grow">
                  <!-- Marca -->
                  <p class="text-xs text-blue-600 dark:text-blue-400 font-bold mb-2 uppercase tracking-wide">
                    {{ product.marca }}
                  </p>

                  <!-- Nombre -->
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {{ product.nombre }}
                  </h3>

                  <!-- Tags -->
                  <div class="flex items-center gap-2 mb-4 text-xs flex-wrap">
                    <span v-if="product.medidas" class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-400">
                      {{ product.medidas }}
                    </span>
                    <span v-if="product.color" class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-400">
                      {{ product.color }}
                    </span>
                  </div>

                  <!-- Precios -->
                  <div class="mb-4">
                    <!-- Precio anterior -->
                    <div v-if="product.precioAnterior && product.precioAnterior > 0" class="mb-1">
                      <span class="text-sm text-gray-500 dark:text-gray-400 line-through">
                        ${{ formatearPrecio(calcularPrecioAnteriorUYU(product)) }}
                      </span>
                    </div>

                    <!-- Precio actual -->
                    <div class="flex items-baseline gap-2 mb-1">
                      <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${{ formatearPrecio(product.precioPorCajaUYU) }}
                      </span>
                      <span class="text-sm text-gray-500">caja</span>
                    </div>

                    <!-- Precio por metro -->
                    <span v-if="product.precioMetro" class="text-sm text-gray-500 dark:text-gray-400">
                      ${{ formatearPrecio(product.precioMetroUYU) }} m²
                    </span>
                  </div>

                  <!-- Metros por caja -->
                  <div v-if="product.metrosPorCaja" class="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                    <span>📦</span>
                    {{ product.metrosPorCaja }} m²/caja
                  </div>
                </div>

                <!-- Botón agregar al carrito -->
                <button
                    @click.stop="addToCart(product)"
                    class="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg group/btn"
                >
                  <svg class="h-5 w-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center">
            <nav class="flex items-center space-x-2">
              <button
                  @click="currentPage > 1 && (currentPage--)"
                  :disabled="currentPage <= 1"
                  class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Anterior
              </button>

              <button
                  v-for="page in displayPages"
                  :key="page"
                  @click="typeof page === 'number' && (currentPage = page)"
                  :class="[
                    'px-4 py-2 rounded-xl transition-all',
                    page === currentPage
                      ? 'bg-blue-600 text-white shadow-md'
                      : typeof page === 'number'
                        ? 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                        : 'text-gray-500 cursor-default'
                  ]"
              >
                {{ page }}
              </button>

              <button
                  @click="currentPage < totalPages && (currentPage++)"
                  :disabled="currentPage >= totalPages"
                  class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Siguiente
              </button>
            </nav>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from '@/stores/cart'
import { useProducts } from '@/composables/useProducts'
import type { ProductoAPIUYU } from '@/stores/products'
import type { Database } from '@/types/database.types'

type Category = Database['public']['Tables']['categories']['Row']

interface CategoryWithCount extends Category {
  productCount: number
}

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const { store, productos, categorias, loading, error, cargarSiEsNecesario } = useProducts()

const selectedCategorySlug = ref<string | null>(null)
const searchTerm = ref<string>('') // Para buscar categorías
const productSearchTerm = ref<string>('') // Para buscar productos
const sortBy = ref<string>('name')
const currentPage = ref<number>(1)
const itemsPerPage = 12

// Computed
const categoriesWithProducts = computed((): CategoryWithCount[] => {
  return categorias.value
      .map(category => {
        const productCount = productos.value.filter(producto =>
            producto.categoria.some(cat => cat.toLowerCase() === category.name.toLowerCase())
        ).length

        return {
          ...category,
          productCount
        }
      })
      .filter(cat => cat.productCount > 0)
      .sort((a, b) => {
        if (a.display_order !== null && b.display_order !== null) {
          return a.display_order - b.display_order
        }
        return a.name.localeCompare(b.name)
      })
})

const filteredCategories = computed((): CategoryWithCount[] => {
  if (!searchTerm.value) return categoriesWithProducts.value

  const term = searchTerm.value.toLowerCase()
  return categoriesWithProducts.value.filter(category =>
      category.name.toLowerCase().includes(term) ||
      category.name?.toLowerCase().includes(term)
  )
})

const currentCategory = computed(() => {
  if (!selectedCategorySlug.value) return null
  return categoriesWithProducts.value.find(cat => cat.slug === selectedCategorySlug.value)
})

const currentCategoryName = computed(() => {
  return currentCategory.value?.name || 'Todas las Categorías'
})

const currentCategoryDescription = computed(() => {
  if (!currentCategory.value) {
    return `Explora nuestro catálogo completo de ${productos.value.length} productos`
  }
  return currentCategory.value.name || `Descubre todos los productos de ${currentCategory.value.name}`
})

const productsByCategory = computed((): ProductoAPIUYU[] => {
  if (!selectedCategorySlug.value) return []

  const categoryName = currentCategory.value?.name.toLowerCase()
  if (!categoryName) return []

  return productos.value.filter(producto =>
      producto.categoria.some(cat => cat.toLowerCase() === categoryName)
  )
})

const filteredProducts = computed((): ProductoAPIUYU[] => {
  let result = productsByCategory.value

  // Filtrar por búsqueda de productos
  if (productSearchTerm.value) {
    const term = productSearchTerm.value.toLowerCase().trim()
    result = result.filter(p => {
      const nombre = p.nombre?.toLowerCase() || ''
      const marca = p.marca?.toLowerCase() || ''
      const tags = Array.isArray(p.tags) ? p.tags.map(t => t.toLowerCase()) : []

      return (
          nombre.includes(term) ||
          marca.includes(term) ||
          tags.some(tag => tag.includes(term))
      )
    })
  }

  // Ordenar
  switch (sortBy.value) {
    case 'price-low':
      result = [...result].sort((a, b) => a.precioPorCajaUYU - b.precioPorCajaUYU)
      break
    case 'price-high':
      result = [...result].sort((a, b) => b.precioPorCajaUYU - a.precioPorCajaUYU)
      break
    case 'newest':
      result = [...result].sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0))
      break
    case 'stock':
      result = [...result].sort((a, b) => (b.stock || 0) - (a.stock || 0))
      break
    default:
      result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre))
  }

  return result
})

const paginatedProducts = computed((): ProductoAPIUYU[] => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

const totalPages = computed((): number => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage)
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

const totalProducts = computed((): number => {
  return productos.value.length
})

const totalBrands = computed((): number => {
  return store.brands.length
})

// Methods
const formatearPrecio = (precio: number): string => {
  return Math.round(precio).toLocaleString('es-UY')
}

const calcularPrecioAnteriorUYU = (product: ProductoAPIUYU): number => {
  if (!product.precioAnterior) return 0
  const ratio = product.precioAnterior / product.precio
  return product.precioPorCajaUYU * ratio
}

const getCategoryIcon = (categoryName: string): string => {
  const icons: Record<string, string> = {
    'pisos': '🏠',
    'revestimientos': '🧱',
    'cocina': '🍳',
    'baño': '🚿',
    'grifería': '🚰',
    'muebles': '🪑',
    'accesorios': '🔧'
  }
  return icons[categoryName.toLowerCase()] || '📦'
}

const selectCategory = (slug: string | null): void => {
  selectedCategorySlug.value = slug
  currentPage.value = 1
  productSearchTerm.value = '' // Limpiar búsqueda de productos

  // Actualizar URL
  if (slug) {
    router.push(`/categories/${slug}`)
  } else {
    router.push('/categories')
  }
}

const goToProduct = (product: ProductoAPIUYU): void => {
  router.push(`/product/${product.slug}`)
}

const addToCart = (product: ProductoAPIUYU): void => {
  cartStore.addItem(product)
}

// Watchers
watch(() => route.params.slug, (newSlug) => {
  if (route.name === 'categories' || route.path.startsWith('/categories')) {
    selectedCategorySlug.value = newSlug ? String(newSlug) : null
  }
}, { immediate: true })

watch(productSearchTerm, () => {
  currentPage.value = 1
})

watch(sortBy, () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(async () => {
  await cargarSiEsNecesario()

  // Establecer categoría desde la ruta si existe
  if (route.params.slug) {
    selectedCategorySlug.value = String(route.params.slug)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>