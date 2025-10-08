<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                :src="category.image"
                :alt="category.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4">
              <h3 class="text-xl font-bold text-white mb-1">{{ category.name }}</h3>
              <p class="text-gray-200 text-sm">{{ category.productCount }} productos</p>
            </div>
          </div>
          <div class="p-4">
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {{ category.description }}
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
              {{ categories.length }}
            </div>
            <div class="text-gray-600 dark:text-gray-400 text-sm">
              Categorías
            </div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              50+
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const searchTerm = ref('')

// Categories data
const categories = ref([
  {
    id: 1,
    name: 'Ofertas',
    description: 'Productos con descuentos especiales y promociones limitadas',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop',
    productCount: 89,
    slug: 'ofertas'
  },
  {
    id: 2,
    name: 'Vinílicos',
    description: 'Pisos vinílicos de alta durabilidad y diseño moderno',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    productCount: 156,
    slug: 'vinilicos'
  },
  {
    id: 3,
    name: 'Pisos',
    description: 'Porcelanatos, cerámicos y laminados para todo tipo de espacios',
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop',
    productCount: 234,
    slug: 'pisos'
  },
  {
    id: 4,
    name: 'Paredes',
    description: 'Revestimientos y cerámicas decorativas para paredes',
    image: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop',
    productCount: 187,
    slug: 'paredes'
  },
  {
    id: 5,
    name: 'Cocina',
    description: 'Mesadas, backsplash y accesorios para cocinas modernas',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    productCount: 143,
    slug: 'cocina'
  },
  {
    id: 6,
    name: 'Baño',
    description: 'Griferías, sanitarios y azulejos para baños completos',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop',
    productCount: 198,
    slug: 'bano'
  },
  {
    id: 7,
    name: 'Exteriores',
    description: 'Productos resistentes para terrazas, jardines y patios',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
    productCount: 76,
    slug: 'exteriores'
  },
  {
    id: 8,
    name: 'Herramientas',
    description: 'Herramientas profesionales para instalación y mantenimiento',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=300&fit=crop',
    productCount: 124,
    slug: 'herramientas'
  }
])

// Computed
const filteredCategories = computed(() => {
  if (!searchTerm.value) return categories.value

  return categories.value.filter(category =>
      category.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const totalProducts = computed(() => {
  return categories.value.reduce((total, category) => total + category.productCount, 0)
})

// Methods
const goToCategory = (category) => {
  router.push(`/categoria/${category.slug}`)
}
</script>