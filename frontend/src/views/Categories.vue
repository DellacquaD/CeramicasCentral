<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="productsStore.loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">Cargando categorías...</span>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Todas las Categorías
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explora nuestra amplia gama de productos organizados por categorías
          </p>
        </div>

        <!-- Search bar -->
        <div class="mb-8 max-w-md mx-auto">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                v-model="searchTerm"
                type="text"
                placeholder="Buscar categorías..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Categories grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
              v-for="category in filteredCategories"
              :key="category.id"
              @click="goToCategory(category)"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
          >
            <div class="relative h-48 overflow-hidden">
              <img
                  v-if="category.image_url"
                  :src="category.image_url"
                  :alt="category.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span class="text-6xl">📦</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4">
                <h3 class="text-xl font-bold text-white mb-1">{{ category.name }}</h3>
                <p class="text-gray-200 text-sm">{{ category.productCount }} productos</p>
              </div>
            </div>
            <div class="p-4">
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {{ category.description || 'Descubre nuestra selección de productos' }}
              </p>
              <div class="flex items-center justify-between">
                <span class="text-blue-600 dark:text-blue-400 font-medium text-sm">
                  Ver productos
                </span>
                <ArrowRightIcon class="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredCategories.length === 0" class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400 text-lg">
            No se encontraron categorías que coincidan con tu búsqueda
          </p>
        </div>

        <!-- Stats section -->
        <div class="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Nuestro Catálogo
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              Números que respaldan nuestra experiencia
            </p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {{ totalProducts }}+
              </div>
              <div class="text-gray-600 dark:text-gray-400 text-sm">
                Productos
              </div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {{ categoriesWithProducts.length }}
              </div>
              <div class="text-gray-600 dark:text-gray-400 text-sm">
                Categorías
              </div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {{ totalBrands }}
              </div>
              <div class="text-gray-600 dark:text-gray-400 text-sm">
                Marcas
              </div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                15
              </div>
              <div class="text-gray-600 dark:text-gray-400 text-sm">
                Años experiencia
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'
import { useProductsStore } from '../stores/products'
import type { Database } from '../types/database.types'

type Category = Database['public']['Tables']['categories']['Row']

interface CategoryWithCount extends Category {
  productCount: number
}

const router = useRouter()
const productsStore = useProductsStore()
const searchTerm = ref('')

// Computed
const categoriesWithProducts = computed((): CategoryWithCount[] => {
  return productsStore.categories
      .map(category => {
        // Contar productos de esta categoría
        const productCount = productsStore.productosActivos.filter(producto =>
            producto.categories.some(cat => cat.id === category.id)
        ).length

        return {
          ...category,
          productCount
        }
      })
      // Filtrar categorías que tienen productos
      .filter(cat => cat.productCount > 0)
      // Ordenar por display_order si existe, sino por nombre
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
      category.description?.toLowerCase().includes(term)
  )
})

const totalProducts = computed((): number => {
  return productsStore.productosActivos.length
})

const totalBrands = computed((): number => {
  return productsStore.brands.length
})

// Methods
const goToCategory = (category: CategoryWithCount): void => {
  router.push(`/categoria/${category.slug}`)
}

// Lifecycle
onMounted(async () => {
  // Los productos ya deberían estar cargados desde App.vue
  // Pero por si acaso, verificamos
  if (!productsStore.initialized) {
    await productsStore.cargarProductos()
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>