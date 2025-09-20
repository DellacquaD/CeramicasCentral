<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <li v-if="categorySlug">
              <router-link to="/categorias" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Categorías
              </router-link>
            </li>
            <ChevronRightIcon v-if="categorySlug" class="w-4 h-4 text-gray-400" />
            <li class="text-gray-900 dark:text-white font-medium">
              {{ pageTitle }}
            </li>
          </ol>
        </nav>

        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ pageTitle }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ products.length }} productos encontrados
        </p>
      </div>

      <!-- Filters and sorting -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <!-- Search -->
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

        <!-- Sort -->
        <select
            v-model="sortBy"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">Ordenar por nombre</option>
          <option value="price-low">Precio menor a mayor</option>
          <option value="price-high">Precio mayor a menor</option>
          <option value="newest">Más recientes</option>
        </select>

        <!-- Grid toggle -->
        <div class="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <button
              @click="gridCols = 3"
              :class="[
              'px-3 py-2 transition-colors',
              gridCols === 3 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            ]"
          >
            <Squares2X2Icon class="w-5 h-5" />
          </button>
          <button
              @click="gridCols = 4"
              :class="[
              'px-3 py-2 transition-colors border-l border-gray-300 dark:border-gray-600',
              gridCols === 4 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            ]"
          >
            <TableCellsIcon class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Products grid -->
      <div :class="[
        'grid gap-6 mb-12',
        gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      ]">
        <div
            v-for="product in filteredProducts"
            :key="product.id"
            @click="goToProduct(product)"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
        >
          <div class="relative">
            <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div v-if="product.discount" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              -{{ product.discount }}%
            </div>
            <button
                @click.stop="$emit('add-to-cart', product)"
                class="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ShoppingCartIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          <div class="p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {{ product.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {{ product.description }}
            </p>

            <div class="flex items-center justify-between">
              <div>
                <span v-if="product.originalPrice" class="text-sm text-gray-500 line-through mr-2">
                  ${{ product.originalPrice.toLocaleString() }}
                </span>
                <span class="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ${{ product.price.toLocaleString() }}
                </span>
              </div>

              <div class="flex items-center">
                <div class="flex text-yellow-400 mr-1">
                  <StarIcon class="w-4 h-4 fill-current" />
                  <StarIcon class="w-4 h-4 fill-current" />
                  <StarIcon class="w-4 h-4 fill-current" />
                  <StarIcon class="w-4 h-4 fill-current" />
                  <StarIcon class="w-4 h-4 text-gray-300 dark:text-gray-600" />
                </div>
                <span class="text-xs text-gray-500">({{ product.reviews }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
              @click="currentPage > 1 && (currentPage--)"
              :disabled="currentPage <= 1"
              class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Anterior
          </button>

          <span
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              :class="[
              'px-3 py-2 rounded-lg cursor-pointer transition-colors',
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            ]"
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
  StarIcon,
  Squares2X2Icon,
  TableCellsIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

// Props
const props = defineProps({
  categorySlug: String
})

// Emits
defineEmits(['add-to-cart'])

// State
const searchTerm = ref('')
const sortBy = ref('name')
const gridCols = ref(3)
const currentPage = ref(1)
const itemsPerPage = 12

// Mock products data
const allProducts = ref([
  {
    id: 1,
    name: 'Piso Vinílico Premium Wood Oak',
    description: 'Piso vinílico que imita madera de roble con alta resistencia al tráfico',
    price: 8500,
    originalPrice: 10000,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    category: 'vinilicos',
    reviews: 24,
    slug: 'piso-vinilico-premium-wood-oak'
  },
  {
    id: 2,
    name: 'Porcelanato Símil Mármol Carrara 60x60',
    description: 'Porcelanato rectificado que simula mármol de Carrara, perfecto para espacios elegantes',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop',
    category: 'pisos',
    reviews: 18,
    slug: 'porcelanato-simil-marmol-carrara-60x60'
  },
  {
    id: 3,
    name: 'Azulejo Subway Blanco 7.5x15',
    description: 'Clásico azulejo tipo subway para cocinas y baños modernos',
    price: 3200,
    originalPrice: 3800,
    discount: 16,
    image: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop',
    category: 'paredes',
    reviews: 45,
    slug: 'azulejo-subway-blanco-7-5x15'
  },
  {
    id: 4,
    name: 'Mesada de Granito Negro Absoluto',
    description: 'Mesada de granito negro con acabado pulido, ideal para cocinas modernas',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    category: 'cocina',
    reviews: 12,
    slug: 'mesada-granito-negro-absoluto'
  },
  {
    id: 5,
    name: 'Grifo Monocomando Cocina Acero Inox',
    description: 'Grifo monocomando extraíble para cocina en acero inoxidable',
    price: 15500,
    originalPrice: 18000,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
    category: 'bano',
    reviews: 31,
    slug: 'grifo-monocomando-cocina-acero-inox'
  },
  {
    id: 6,
    name: 'Inodoro con Descarga Dual',
    description: 'Inodoro moderno con sistema de descarga dual para ahorro de agua',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop',
    category: 'bano',
    reviews: 28,
    slug: 'inodoro-descarga-dual'
  }
])

// Computed
const products = computed(() => {
  if (props.categorySlug) {
    return allProducts.value.filter(product => product.category === props.categorySlug)
  }
  return allProducts.value
})

const pageTitle = computed(() => {
  if (props.categorySlug) {
    const categoryNames = {
      'vinilicos': 'Vinílicos',
      'pisos': 'Pisos',
      'paredes': 'Paredes',
      'cocina': 'Cocina',
      'bano': 'Baño',
      'ofertas': 'Ofertas'
    }
    return categoryNames[props.categorySlug] || 'Productos'
  }
  return 'Todos los Productos'
})

const filteredProducts = computed(() => {
  let result = products.value

  // Filter by search term
  if (searchTerm.value) {
    result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  // Sort products
  switch (sortBy.value) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      result.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      result.sort((a, b) => b.id - a.id)
      break
    default:
      result.sort((a, b) => a.name.localeCompare(b.name))
  }

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return result.slice(start, end)
})

const totalPages = computed(() => {
  const filtered = products.value.filter(product => {
    if (!searchTerm.value) return true
    return product.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.value.toLowerCase())
  })
  return Math.ceil(filtered.length / itemsPerPage)
})

// Methods
const goToProduct = (product) => {
  router.push(`/producto/${product.slug}`)
}

// Watch for category changes
watch(() => props.categorySlug, () => {
  currentPage.value = 1
  searchTerm.value = ''
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>