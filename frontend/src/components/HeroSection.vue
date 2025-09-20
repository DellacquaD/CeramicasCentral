<template>
  <section class="relative overflow-hidden">
    <!-- Background with gradient and tile pattern -->
    <div class="h-96 bg-gradient-to-br from-gray-700 to-gray-950 relative">
      <!-- Animated tile pattern with rotating images -->
      <div class="absolute inset-0">
        <div class="grid grid-cols-10 gap-1 h-full p-6 opacity-20">
          <div
              v-for="i in 30"
              :key="i"
              class="bg-white rounded-sm transform transition-all duration-1000 hover:scale-105 overflow-hidden relative"
              :style="{
              animationDelay: `${Math.random() * 2}s`,
              animation: `float 6s ease-in-out infinite`
            }"
          >
            <!-- Transición suave entre imágenes -->
            <div class="w-full h-full relative">
              <!-- Imagen actual -->
              <img
                  :src="getTileCurrentImage(i)"
                  :alt="`Producto ${i}`"
                  class="w-full h-full object-cover absolute inset-0 transition-opacity duration-1000"
                  :style="{
                  opacity: tileTransitioning[i] ? 0 : (0.7 + (i % 3) * 0.1)
                }"
                  loading="lazy"
              />
              <!-- Imagen siguiente (aparece durante la transición) -->
              <img
                  v-if="tileNextImages[i]"
                  :src="tileNextImages[i]"
                  :alt="`Producto ${i} siguiente`"
                  class="w-full h-full object-cover absolute inset-0 transition-opacity duration-1000"
                  :style="{
                  opacity: tileTransitioning[i] ? (0.7 + (i % 3) * 0.1) : 0
                }"
                  loading="lazy"
              />
            </div>
            <!-- Overlay for better blend -->
            <div class="absolute inset-0 bg-white/40"></div>
          </div>
        </div>
      </div>

      <!-- Decorative elements -->
      <div class="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

      <!-- Main content -->
      <div class="absolute inset-0 flex flex-col items-center justify-center px-8">
        <!-- Title -->
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold text-white mb-4 leading-tight">
            Todo para tu
            <span class="text-blue-200">Remodelación</span>
          </h1>
          <p class="text-xl text-blue-100 max-w-2xl">
            Encuentra los mejores materiales y productos para tus proyectos
          </p>
        </div>

        <!-- Search bar -->
        <div class="w-full max-w-4xl">
          <div class="relative group">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              <div class="flex items-center">
                <div class="flex-1 relative">
                  <MagnifyingGlassIcon class="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                      v-model="searchQuery"
                      @keyup.enter="handleSearch"
                      type="text"
                      placeholder="¿Qué estás buscando? Ej: vinílicos, pisos, azulejos..."
                      class="w-full pl-16 pr-6 py-6 text-lg bg-transparent border-0 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                <!-- Search button -->
                <button
                    @click="handleSearch"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 font-medium text-lg transition-colors duration-200 hover:shadow-lg"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <!-- Quick search suggestions -->
          <div class="mt-6 text-center">
            <span class="text-blue-100 text-sm font-medium mr-4">Búsquedas populares:</span>
            <div class="inline-flex flex-wrap gap-3 mt-2">
              <button
                  v-for="suggestion in quickSearches"
                  :key="suggestion"
                  @click="quickSearch(suggestion)"
                  class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

// Emits
const emit = defineEmits(['search'])

// Local state
const searchQuery = ref('')
const tileImages = ref({}) // Imagen actual de cada tile
const tileNextImages = ref({}) // Próxima imagen de cada tile
const tileTransitioning = ref({}) // Estado de transición de cada tile
const tileIntervals = ref(new Map()) // Map para almacenar los intervalos de cada tile

// Array de imágenes disponibles
const imageUrls = ref([
  // Cerámicas y pisos
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=100&h=100&fit=crop',

  // Baños y griferías
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=100&h=100&fit=crop',

  // Cocinas
  'https://images.unsplash.com/photo-1556185781-a47769abb7b4?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1556185399-e77a74475434?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop',

  // Vinílicos y materiales
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop'
])

// Intervalo para cambiar imágenes - ya no es necesario un intervalo global
// let imageChangeInterval = null - Eliminado

// Quick search suggestions
const quickSearches = ref([
  'Ofertas del mes',
  'Piso vinílico',
  'Porcelanato 60x60',
  'Azulejos para baño',
  'Mesada de cocina'
])

// Methods
const getTileCurrentImage = (tileIndex) => {
  // Si no existe imagen para este tile, asignar una inicial
  if (!tileImages.value[tileIndex]) {
    tileImages.value[tileIndex] = imageUrls.value[tileIndex % imageUrls.value.length]
  }
  return tileImages.value[tileIndex]
}

const getRandomImageForTile = (tileIndex) => {
  // Obtener una imagen aleatoria diferente a la actual
  const currentImage = tileImages.value[tileIndex]
  let newImage
  do {
    newImage = imageUrls.value[Math.floor(Math.random() * imageUrls.value.length)]
  } while (newImage === currentImage && imageUrls.value.length > 1)

  return newImage
}

const transitionToNewImage = (tileIndex, newImage) => {
  // Configurar la nueva imagen
  tileNextImages.value[tileIndex] = newImage

  // Iniciar transición (imagen actual se desvanece, nueva aparece)
  tileTransitioning.value[tileIndex] = true

  // Después de que termine la transición (1000ms), intercambiar las imágenes
  setTimeout(() => {
    tileImages.value[tileIndex] = newImage
    tileNextImages.value[tileIndex] = null
    tileTransitioning.value[tileIndex] = false
  }, 1000)
}

const createTileInterval = (tileIndex) => {
  // Tiempo aleatorio entre 2 y 22 segundos (según tu ajuste)
  const randomInterval = Math.random() * 2000 + 12000

  const intervalId = setInterval(() => {
    // Obtener nueva imagen y hacer transición suave
    const newImage = getRandomImageForTile(tileIndex)
    transitionToNewImage(tileIndex, newImage)
  }, randomInterval)

  return intervalId
}

const initializeTiles = () => {
  // Inicializar cada tile con una imagen y crear su intervalo
  for (let i = 1; i <= 100; i++) {
    // Asignar imagen inicial
    tileImages.value[i] = imageUrls.value[(i - 1) % imageUrls.value.length]
    tileTransitioning.value[i] = false

    // Crear intervalo con delay inicial aleatorio
    setTimeout(() => {
      const intervalId = createTileInterval(i)
      tileIntervals.value.set(i, intervalId)
    }, Math.random() * 5000) // Delay inicial aleatorio de 0-5 segundos
  }
}

const stopAllIntervals = () => {
  tileIntervals.value.forEach((intervalId) => {
    clearInterval(intervalId)
  })
  tileIntervals.value.clear()
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', {
      query: searchQuery.value.trim()
    })
  }
}

const quickSearch = (suggestion) => {
  searchQuery.value = suggestion
  handleSearch()
}

// Lifecycle
onMounted(() => {
  initializeTiles()
})

onUnmounted(() => {
  stopAllIntervals()
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
}

.grid-cols-20 {
  grid-template-columns: repeat(20, minmax(0, 1fr));
}
</style>