<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Bienvenido al panel de administración
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Productos</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ stats.totalProducts }}
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-green-600 dark:text-green-400 font-medium">
            {{ stats.activeProducts }} activos
          </span>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Categorías</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ stats.totalCategories }}
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ stats.totalSubcategories }} subcategorías
          </span>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Marcas</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ stats.totalBrands }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-green-600 dark:text-green-400 font-medium">
            {{ stats.activeBrands }} activas
          </span>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Tags</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ stats.totalTags }}
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ stats.totalColors }} colores, {{ stats.totalMaterials }} materiales
          </span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
            to="/admin/products/new"
            class="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group"
        >
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Nuevo Producto</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Agregar producto al catálogo</p>
          </div>
        </router-link>

        <router-link
            to="/admin/categories"
            class="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors group"
        >
          <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Gestionar Categorías</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Organizar el catálogo</p>
          </div>
        </router-link>

        <router-link
            to="/admin/brands"
            class="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors group"
        >
          <div class="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/40">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Gestionar Marcas</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Añadir y editar marcas</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Recent Products -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Productos Recientes</h2>
          <router-link
              to="/admin/products"
              class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Ver todos
          </router-link>
        </div>
      </div>
      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
        <div v-else-if="recentProducts.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          No hay productos recientes
        </div>
        <div v-else class="space-y-4">
          <div
              v-for="product in recentProducts"
              :key="product.id"
              class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span class="text-2xl">📦</span>
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ product.nombre }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">SKU: {{ product.sku }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                product.activo ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
              ]">
                {{ product.activo ? 'Activo' : 'Inactivo' }}
              </span>
              <router-link
                  :to="`/admin/products/${product.id}`"
                  class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Editar
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()
const loading = ref(true)
const recentProducts = ref<any[]>([])

const stats = computed(() => ({
  totalProducts: productsStore.productos.length,
  activeProducts: productsStore.productosActivos.length,
  totalCategories: productsStore.categories.length,
  totalSubcategories: productsStore.subcategories.length,
  totalBrands: productsStore.brands.length,
  activeBrands: productsStore.brands.filter((b: any) => b.is_active).length,
  totalTags: productsStore.tags.length,
  totalColors: productsStore.colors.length,
  totalMaterials: productsStore.materials.length
}))

onMounted(async () => {
  try {
    // Cargar datos si no están cargados
    if (!productsStore.initialized) {
      await productsStore.cargarProductos()
    }

    // Obtener productos recientes (últimos 5)
    recentProducts.value = productsStore.productos.slice(0, 5)
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>