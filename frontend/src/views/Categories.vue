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

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">Cargando categorías...</span>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-20">
        <div class="text-red-600 dark:text-red-400 mb-4">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <p class="text-xl font-semibold">Error al cargar las categorías</p>
          <p class="text-gray-600 dark:text-gray-400 mt-2">{{ error }}</p>
        </div>
        <button
            @click="fetchCategories"
            class="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>Reintentar</span>
        </button>
      </div>

      <!-- Categories grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <!-- Tag badge -->
            <div v-if="category.tag" class="absolute top-4 right-4">
              <span class="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {{ category.tag }}
              </span>
            </div>
          </div>
          <div class="p-4">
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {{ category.description }}
            </p>
            <!-- Subcategories preview -->
            <div v-if="category.subcategories && category.subcategories.length > 0" class="mb-3">
              <div class="flex flex-wrap gap-1 mb-2">
                <span
                    v-for="(subcat, index) in category.subcategories.slice(0, 2)"
                    :key="subcat.id"
                    class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded"
                >
                  {{ subcat.nombre }}
                </span>
                <span
                    v-if="category.subcategories.length > 2"
                    class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs px-2 py-1 rounded"
                >
                  +{{ category.subcategories.length - 2 }}
                </span>
              </div>
            </div>
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
      <div v-if="!loading && !error" class="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
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
              {{ totalSubcategories }}
            </div>
            <div class="text-gray-600 dark:text-gray-400 text-sm">
              Subcategorías
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const searchTerm = ref('')

// Reactive data
const categories = ref([])
const loading = ref(false)
const error = ref(null)

// API URL
const API_URL = ''

// Methods
const fetchCategories = async () => {
  loading.value = true
  error.value = null

  try {
    console.log('Intentando fetch a:', API_URL)

    const response = await fetch(API_URL, {
      method: 'GET',
      mode: 'cors', // Explicito para CORS
      cache: 'no-cache', // Evitar caché
    })

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Data recibida:', data)

    if (data.categorias) {
      categories.value = transformApiData(data.categorias)
      console.log('Categorías cargadas:', categories.value.length)
    } else {
      throw new Error('Formato de respuesta inesperado - no se encontró "categorias"')
    }


  } catch (err) {
    console.error('Error al cargar categorías:', err)
    error.value = err.message || 'Error desconocido al cargar las categorías'

    // Fallback: usar datos estáticos si la API falla
    categories.value = getFallbackCategories()
    console.log('Usando datos de fallback')
  } finally {
    loading.value = false
  }
}

// Transformar datos de la API al formato esperado
const transformApiData = (categorias) => {
  console.log('=== TRANSFORMANDO DATA ===')
  console.log('Categorías recibidas:', Object.keys(categorias))

  const categoryTags = {
    'revestimientos': 'Decorativo',
    'pisos': 'Resistente',
    'cocina': 'Funcional',
    'griferia': 'Premium',
    'bano': 'Sanitario'
  }

  const transformed = []
  let categoryId = 1

  try {
    // Procesamos cada categoría principal
    Object.entries(categorias).forEach(([key, category]) => {
      console.log(`Procesando categoría: ${key}`, category)

      // Contamos el total de subcategorías
      const totalSubcategories = category.subcategoria?.length || 0
      console.log(`${key}: ${totalSubcategories} subcategorías`)

      // Calculamos productos estimados
      const estimatedProducts = totalSubcategories * 30 + Math.floor(Math.random() * 100)

      const transformedCategory = {
        id: categoryId++,
        name: category.nombre,
        description: `${totalSubcategories} subcategorías disponibles con productos de alta calidad`,
        image: category.portada || getDefaultImage(key),
        productCount: estimatedProducts,
        tag: categoryTags[key] || 'Disponible',
        subcategories: category.subcategoria || [],
        slug: key
      }

      transformed.push(transformedCategory)
      console.log(`Categoría ${key} transformada exitosamente`)
    })

    console.log('Transformación completada:', transformed.length, 'categorías')
    return transformed

  } catch (error) {
    console.error('Error en transformApiData:', error)
    throw error
  }
}

// Obtener imagen por defecto según la categoría
const getDefaultImage = (categoryKey) => {
  const defaultImages = {
    'revestimientos': 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop',
    'pisos': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    'cocina': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    'griferia': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
    'bano': 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop'
  }
  return defaultImages[categoryKey] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
}

// Datos de fallback
const getFallbackCategories = () => [
  {
    id: 1,
    name: 'Revestimientos',
    description: 'Revestimientos cerámicos de alta calidad para diversos espacios',
    image: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop',
    productCount: 85,
    tag: 'Decorativo',
    subcategories: [
      { id: 1, nombre: 'Ceramica/Porcelanato' },
      { id: 2, nombre: 'WPC' }
    ],
    slug: 'revestimientos'
  },
  {
    id: 2,
    name: 'Pisos',
    description: 'Pisos de alta resistencia y durabilidad',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    productCount: 95,
    tag: 'Resistente',
    subcategories: [
      { id: 5, nombre: 'Porcelanatos' },
      { id: 6, nombre: 'Cerámicas' }
    ],
    slug: 'pisos'
  },
  {
    id: 3,
    name: 'Cocina',
    description: 'Muebles y accesorios para cocina funcional',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    productCount: 65,
    tag: 'Funcional',
    subcategories: [
      { id: 8, nombre: 'Mesadas' },
      { id: 9, nombre: 'Piletas' }
    ],
    slug: 'cocina'
  },
  {
    id: 4,
    name: 'Grifería',
    description: 'Grifería moderna para cocina y baño',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
    productCount: 45,
    tag: 'Premium',
    subcategories: [
      { id: 11, nombre: 'Cocina' },
      { id: 12, nombre: 'Baño' }
    ],
    slug: 'griferia'
  },
  {
    id: 5,
    name: 'Baño',
    description: 'Sanitarios y accesorios para baño completo',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop',
    productCount: 75,
    tag: 'Sanitario',
    subcategories: [
      { id: 13, nombre: 'Sanitarios' },
      { id: 14, nombre: 'Muebles con bacha' }
    ],
    slug: 'bano'
  }
]

// Computed properties
const filteredCategories = computed(() => {
  if (!searchTerm.value) return categories.value

  return categories.value.filter(category =>
      category.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      category.subcategories?.some(sub =>
          sub.nombre.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
  )
})

const totalProducts = computed(() => {
  return categories.value.reduce((total, category) => total + category.productCount, 0)
})

const totalSubcategories = computed(() => {
  return categories.value.reduce((total, category) => total + (category.subcategories?.length || 0), 0)
})

// Navigation method
const goToCategory = (category) => {
  router.push(`/categoria/${category.slug}`)
}

// Lifecycle
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>