<template>
  <section class="max-w-screen-2xl mx-auto py-16">
    <!-- Section header -->
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Nuestras <span class="text-blue-600">Categorías</span>
      </h2>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
        Explora nuestra amplia gama de productos para construcción y decoración.
        Encuentra todo lo que necesitas para tu proyecto.
      </p>
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
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      <ProductCard
          v-for="category in categories"
          :key="category.id"
          :category="category"
          :currency="currency"
          @select="handleCategorySelect"
          class="category-card"
          :class="[
          category.featured ? 'xl:col-span-2' : '',
          category.size === 'large' ? 'lg:col-span-2' : ''
        ]"
      />
    </div>

    <!-- View all categories button -->
    <div v-if="!loading && !error" class="text-center mt-16">
      <button
          @click="$emit('viewAll')"
          class="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
      >
        <span class="text-lg">Ver todas las categorías</span>
        <ArrowRightIcon class="w-6 h-6" />
      </button>
    </div>

    <!-- Statistics -->
    <div v-if="!loading && !error" class="mt-20 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-12">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div
            v-for="stat in statistics"
            :key="stat.label"
            class="text-center"
        >
          <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {{ stat.value }}
          </div>
          <div class="text-gray-600 dark:text-gray-400 font-medium">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import ProductCard from './ProductCard.vue'

// Props
defineProps({
  currency: {
    type: String,
    default: 'UYU'
  }
})

// Emits
const emit = defineEmits(['categorySelect', 'viewAll'])

// Reactive data
const categories = ref([])
const loading = ref(false)
const error = ref(null)

// Statistics (se actualizarán dinámicamente)
const statistics = ref([
  { value: '1000+', label: 'Productos' },
  { value: '50+', label: 'Marcas' },
  { value: '15+', label: 'Años en el rubro' },
  { value: '5000+', label: 'Clientes satisfechos' }
])

// API URL
const API_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhKeGZD5OLNYJ1OxyfLP8BNY3JNo3OFiiZxT4-QnhcgJ3jC-vrJ6y5r8Pzj4EggefQgkrKjkO17WDywUdvVAdBjPWS9H-UHYBb_GX9WIHgOeJLfDexF7aYjm1kmXMt2lNJoHrWNzmqw6zmo07h1hmE7cB0FchF5pNKIAkYw_i8Pk46_dnm_p_wSGxkF7JqGZSHB8acV2zU6IzgxFACu4ERaYOG_AdDmr3U1P3Pv0V4XK-4ip_n3DkUzS60TTiLNyN538UbVNi-a4oQT3l93PycGAwaA8QXn-stbk-s0&lib=MTy7B8BF7g5qhW1WJ95h9kYjCXqaogIk3'

// Actualizar estadísticas basadas en los datos de la API
const updateStatistics = (categoriesData) => {
  const totalSubcategories = categoriesData.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0)
  const totalProducts = categoriesData.reduce((sum, cat) => sum + cat.productCount, 0)

  statistics.value = [
    { value: `${totalProducts}+`, label: 'Productos' },
    { value: `${categoriesData.length}`, label: 'Categorías' },
    { value: `${totalSubcategories}`, label: 'Subcategorías' },
    { value: '5000+', label: 'Clientes satisfechos' }
  ]
}

// Methods
const fetchCategories = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Procesamos el formato específico de la API
    if (data.categorias) {
      categories.value = transformApiData(data.categorias)
      updateStatistics(categories.value)
      console.log('Categorías cargadas:', categories.value.length)
    } else {
      throw new Error('Formato de respuesta inesperado - no se encontró "categorias"')
    }

  } catch (err) {
    console.error('Error al cargar categorías:', err)
    error.value = err.message || 'Error desconocido al cargar las categorías'

    // Fallback: usar datos estáticos si la API falla
    // categories.value = getFallbackCategories()
  } finally {
    loading.value = false
  }
}

// Transformar datos de la API al formato esperado por el componente

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

// Datos de fallback en caso de error
// const getFallbackCategories = () => [
//   {
//     id: 1,
//     name: 'Cerámicas',
//     description: 'Revestimientos cerámicos de alta calidad para cocina, baño y espacios exteriores',
//     image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
//     productCount: 245,
//     tag: 'Más Popular',
//     featured: true,
//     size: 'large',
//     features: ['Antideslizante', 'Resistente al agua', 'Fácil limpieza'],
//     priceRange: { min: 890, max: 4500 }
//   },
//   {
//     id: 2,
//     name: 'Griferías para Baño',
//     description: 'Grifos modernos, mezcladores y accesorios para baño con diseño contemporáneo',
//     image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
//     productCount: 156,
//     tag: 'Premium',
//     features: ['Ahorro de agua', 'Garantía 5 años', 'Instalación fácil'],
//     priceRange: { min: 2500, max: 15000 }
//   },
//   {
//     id: 3,
//     name: 'Porcelanatos',
//     description: 'Pisos de porcelanato de alta resistencia con acabados premium',
//     image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
//     productCount: 189,
//     tag: 'Resistente',
//     features: ['Alta durabilidad', 'Variedad de diseños', 'Bajo mantenimiento'],
//     priceRange: { min: 1200, max: 8500 }
//   },
//   {
//     id: 4,
//     name: 'Revestimientos',
//     description: 'Revestimientos decorativos para interiores y exteriores',
//     image: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&h=600&fit=crop',
//     productCount: 134,
//     tag: 'Decorativo',
//     features: ['Diseños únicos', 'Fácil aplicación', 'Resistente a UV'],
//     priceRange: { min: 650, max: 3500 }
//   },
//   {
//     id: 5,
//     name: 'Loza Sanitaria',
//     description: 'Inodoros, lavabos, bidets y accesorios sanitarios de primera calidad',
//     image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
//     productCount: 98,
//     tag: 'Sanitario',
//     size: 'large',
//     features: ['Descarga dual', 'Diseño ergonómico', 'Fácil instalación'],
//     priceRange: { min: 3500, max: 25000 }
//   },
//   {
//     id: 6,
//     name: 'Cocinas',
//     description: 'Muebles de cocina, mesadas y accesorios para espacios funcionales',
//     image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
//     productCount: 87,
//     tag: 'Funcional',
//     features: ['Medidas personalizadas', 'Materiales premium', 'Garantía extendida'],
//     priceRange: { min: 15000, max: 150000 }
//   }
// ]

const handleCategorySelect = (category) => {
  emit('categorySelect', category)
}

// Lifecycle
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.category-card {
  @apply transform transition-all duration-300;
}

.category-card:hover {
  @apply scale-[1.02];
}

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