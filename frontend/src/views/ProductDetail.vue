<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-96">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">Cargando producto...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="text-red-600 dark:text-red-400 mb-4">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <p class="text-xl font-semibold">Producto no encontrado</p>
          <p class="text-gray-600 dark:text-gray-400 mt-2">{{ error }}</p>
        </div>
        <router-link
            to="/productos"
            class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
        >
          Ver todos los productos
        </router-link>
      </div>

      <!-- Product Content -->
      <template v-else-if="producto">
        <!-- Breadcrumb -->
        <nav class="flex mb-8" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <router-link to="/" class="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                Inicio
              </router-link>
            </li>
            <ChevronRightIcon class="w-4 h-4 text-gray-400" />
            <li>
              <router-link to="/productos" class="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                Productos
              </router-link>
            </li>
            <ChevronRightIcon class="w-4 h-4 text-gray-400" />
            <li>
              <router-link :to="`/categoria/${producto.categoria.toLowerCase()}`" class="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                {{ producto.categoria }}
              </router-link>
            </li>
            <ChevronRightIcon class="w-4 h-4 text-gray-400" />
            <li class="text-gray-900 dark:text-white font-medium truncate max-w-xs">
              {{ producto.nombre }}
            </li>
          </ol>
        </nav>

        <!-- Product Main Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <!-- Image Gallery -->
          <div class="space-y-4">
            <!-- Main Image with Navigation -->
            <div
                class="relative aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg group"
                @mouseenter="pauseAutoplay"
                @mouseleave="resumeAutoplay"
            >
              <!-- Image with Transition -->
              <transition name="fade-slide" mode="out-in">
                <img
                    :key="imagenActualIndex"
                    :src="imagenActual"
                    :alt="producto.nombre"
                    class="w-full h-full object-cover"
                />
              </transition>

              <!-- Navigation Arrows (solo si hay más de una imagen) -->
              <template v-if="todasLasImagenes.length > 1">
                <button
                    @click="prevImage"
                    class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-gray-700 hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                    @click="nextImage"
                    class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-gray-700 hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <!-- Image Counter & Autoplay Indicator -->
                <div class="absolute bottom-4 right-4 flex items-center gap-2">
                  <div class="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    {{ imagenActualIndex + 1 }} / {{ todasLasImagenes.length }}
                  </div>
                  <button
                      @click="toggleAutoplay"
                      class="bg-black/60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 transition-colors"
                      :title="isAutoplayPaused ? 'Reproducir' : 'Pausar'"
                  >
                    <svg v-if="isAutoplayPaused" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  </button>
                </div>
              </template>
            </div>

            <!-- Thumbnail Gallery with Navigation -->
            <div v-if="todasLasImagenes.length > 1" class="relative">
              <!-- Left Arrow for Thumbnails -->
              <button
                  v-if="canScrollThumbnailsLeft"
                  @click="scrollThumbnailsLeft"
                  class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <!-- Thumbnails Container -->
              <div class="overflow-hidden px-8">
                <div class="grid grid-cols-6 gap-3">
                  <button
                      v-for="(imagen, index) in thumbnailsVisibles"
                      :key="thumbnailRealIndex(index)"
                      @click="selectThumbnail(thumbnailRealIndex(index))"
                      :class="[
                        'aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300',
                        imagenActualIndex === thumbnailRealIndex(index)
                          ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2 scale-105 shadow-lg'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:scale-105 hover:shadow-md'
                      ]"
                  >
                    <img
                        :src="imagen"
                        :alt="`${producto.nombre} ${thumbnailRealIndex(index) + 1}`"
                        class="w-full h-full object-cover"
                    />
                  </button>
                </div>
              </div>

              <!-- Right Arrow for Thumbnails -->
              <button
                  v-if="canScrollThumbnailsRight"
                  @click="scrollThumbnailsRight"
                  class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Progress Bar for Autoplay -->
            <div v-if="todasLasImagenes.length > 1 && !isAutoplayPaused" class="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                  class="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-linear autoplay-progress"
                  :style="{ width: '100%' }"
              />
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <!-- Badges -->
            <div class="flex flex-wrap gap-2">
              <span v-if="producto.nuevo" class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                NUEVO
              </span>
              <span v-if="producto.enOferta" class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                OFERTA
              </span>
              <span :class="stockBadgeClass" class="px-3 py-1 rounded-full text-sm font-bold">
                {{ stockText }}
              </span>
            </div>

            <!-- Brand -->
            <div>
              <p class="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-2">{{ producto.marca }}</p>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ producto.nombre }}</h1>
            </div>

            <!-- Price -->
            <div class="border-t border-b border-gray-200 dark:border-gray-700 py-4 flex justify-around items-center">
              <div class="flex items-baseline gap-3 mb-2">
                <span v-if="producto.precioAnterior && producto.precioAnterior > 0" class="text-xl text-gray-500 line-through">
                  ${{ producto.precioAnterior?.toLocaleString('es-UY') }}
                </span>
                <span class="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  ${{ precioTotal.toLocaleString('es-UY') }}
                  <span class="text-2xl">/caja</span>
                </span>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <p>${{ parseInt(producto.precioMetro.toFixed(2)) }}/m²</p>
                <p v-if="producto.metrosPorCaja">{{ producto.metrosPorCaja }} m²/caja</p>
              </div>
            </div>

            <!-- Quantity Selector -->
            <div class="space-y-4">
              <div class="flex items-center gap-4 flex-col">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad:</label>
                <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lgs">
                  <button
                      @click="decrementQuantity"
                      :disabled="quantity <= 1"
                      class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <MinusIcon class="w-5 h-5" />
                  </button>
                  <input
                      v-model.number="quantity"
                      type="number"
                      min="1"
                      :max="producto.stock"
                      class="w-20 text-center border-x border-gray-300 dark:border-gray-600 py-2 bg-transparent focus:outline-none"
                  />
                  <button
                      @click="incrementQuantity"
                      :disabled="quantity >= producto.stock"
                      class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PlusIcon class="w-5 h-5" />
                  </button>
                </div>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ quantity * producto.metrosPorCaja }} m² total
                </span>
              </div>

              <p class="text-sm text-gray-500 dark:text-gray-400">
                Stock disponible: {{ producto.stock }} {{ producto.unidad }}
              </p>
            </div>

            <!-- Add to Cart Button -->
            <div class="flex gap-4">
              <button
                  @click="addToCart"
                  :disabled="producto.stock <= 0"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-xl transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                <ShoppingCartIcon class="w-6 h-6" />
                {{ producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock' }}
              </button>
              <button
                  @click="cartStore.checkout()"
                  :disabled="producto.stock <= 0"
                  class="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-xl transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                Comprar Ahora
              </button>
            </div>

            <!-- Product Features -->
            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-3">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Características</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div v-if="producto.medidas">
                  <span class="text-gray-600 dark:text-gray-400">Medidas:</span>
                  <p class="font-medium text-gray-900 dark:text-white">{{ producto.medidas }}</p>
                </div>
                <div v-if="producto.color">
                  <span class="text-gray-600 dark:text-gray-400">Color:</span>
                  <p class="font-medium text-gray-900 dark:text-white">{{ producto.color }}</p>
                </div>
                <div v-if="producto.pei">
                  <span class="text-gray-600 dark:text-gray-400">PEI:</span>
                  <p class="font-medium text-gray-900 dark:text-white">{{ producto.pei }}</p>
                </div>
                <div v-if="producto.unidad">
                  <span class="text-gray-600 dark:text-gray-400">Unidad:</span>
                  <p class="font-medium text-gray-900 dark:text-white">{{ producto.unidad }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Description Section -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-12">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Descripción</h2>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ producto.descripcion || 'Descripción no disponible.' }}
          </p>
        </div>

        <!-- Related Products -->
        <div v-if="productosRelacionados.length > 0" class="mb-12">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Productos Relacionados</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
                v-for="relatedProduct in productosRelacionados"
                :key="relatedProduct.id"
                @click="goToProduct(relatedProduct)"
                class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div class="aspect-square bg-gray-200 dark:bg-gray-700">
                <img
                    v-if="relatedProduct.imagenPrincipal"
                    :src="relatedProduct.imagenPrincipal"
                    :alt="relatedProduct.nombre"
                    class="w-full h-full object-cover"
                />
              </div>
              <div class="p-4">
                <p class="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">{{ relatedProduct.marca }}</p>
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{{ relatedProduct.nombre }}</h3>
                <p class="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ${{ (relatedProduct.precioMetro * relatedProduct.metrosPorCaja).toFixed(0) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronRightIcon, ShoppingCartIcon, MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'

interface Producto {
  id: string | number
  sku?: number
  nombre: string
  descripcion: string
  marca: string
  categoria: string
  subcategoria?: string
  precio?: number
  precioMetro: number
  precioAnterior?: number
  metrosPorCaja: number
  stock: number
  unidad: string
  medidas?: string
  color?: string
  material?: string
  pei?: string | number
  imagenPrincipal?: string
  imagenesSecundarias?: string[]
  disponible: boolean
  activo: boolean
  destacado?: boolean
  nuevo?: boolean
  enOferta?: boolean
  slug: string
  moneda?: string
  fechaCreacion?: string
  fechaActualizacion?: string
}

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const producto = ref<Producto | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const quantity = ref(1)
const imagenActualIndex = ref(0)
const thumbnailStartIndex = ref(0)
const autoplayInterval = ref<number | null>(null)
const isAutoplayPaused = ref(false)
const productosRelacionados = ref<Producto[]>([])

const API_URL = 'https://ceramicascentral.netlify.app/.netlify/functions/products'

const THUMBNAIL_MAX_VISIBLE = 6
const AUTOPLAY_DELAY = 4000 // 4 segundos

const todasLasImagenes = computed(() => {
  if (!producto.value) return []
  const imgs: string[] = []

  // Agregar imagen principal
  if (producto.value.imagenPrincipal) {
    imgs.push(producto.value.imagenPrincipal)
  }

  // Agregar imágenes secundarias
  if (producto.value.imagenesSecundarias && producto.value.imagenesSecundarias.length > 0) {
    imgs.push(...producto.value.imagenesSecundarias)
  }

  return imgs.filter(Boolean)
})

const imagenActual = computed(() => {
  return todasLasImagenes.value[imagenActualIndex.value] || ''
})

const thumbnailsVisibles = computed(() => {
  const start = thumbnailStartIndex.value
  const end = start + THUMBNAIL_MAX_VISIBLE
  return todasLasImagenes.value.slice(start, end)
})

const canScrollThumbnailsLeft = computed(() => {
  return thumbnailStartIndex.value > 0
})

const canScrollThumbnailsRight = computed(() => {
  return thumbnailStartIndex.value + THUMBNAIL_MAX_VISIBLE < todasLasImagenes.value.length
})

const thumbnailRealIndex = (visibleIndex: number) => {
  return thumbnailStartIndex.value + visibleIndex
}

const precioTotal = computed(() => {
  if (!producto.value) return 0
  return parseInt((producto.value.precioMetro * producto.value.metrosPorCaja).toFixed(2))
})

const stockBadgeClass = computed(() => {
  if (!producto.value) return ''
  if (producto.value.stock > 50) return 'bg-green-100 text-green-800'
  if (producto.value.stock > 10) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
})

const stockText = computed(() => {
  if (!producto.value) return ''
  if (producto.value.stock > 50) return 'Stock alto'
  if (producto.value.stock > 10) return 'Stock medio'
  if (producto.value.stock > 0) return 'Últimas unidades'
  return 'Sin stock'
})

const cargarProducto = async () => {
  loading.value = true
  error.value = null

  try {
    const slug = route.params.productSlug  // ← Cambiado de slug a productSlug

    if (!slug) {
      error.value = 'No se especificó un producto'
      loading.value = false
      return
    }

    console.log('Buscando producto con slug:', slug)

    const response = await fetch(API_URL)
    const data = await response.json()

    console.log('Productos recibidos:', data.productos?.length)

    if (data.productos) {
      // Buscar por slug (case insensitive y con normalización)
      const searchSlug = String(slug).toLowerCase().trim()

      // Buscar primero por slug exacto
      let found = data.productos.find((p: Producto) => {
        const productSlug = String(p.slug || '').toLowerCase().trim()
        return productSlug === searchSlug
      })

      // Si no se encuentra, buscar por ID como fallback
      if (!found) {
        found = data.productos.find((p: Producto) => String(p.id) === String(slug))
        console.log('Buscando por ID:', slug, 'encontrado:', !!found)
      }

      if (found) {
        console.log('Producto encontrado:', found.nombre)
        producto.value = found
        imagenActualIndex.value = 0
        thumbnailStartIndex.value = 0

        // Iniciar autoplay
        startAutoplay()

        // Cargar productos relacionados
        productosRelacionados.value = data.productos
            .filter((p: Producto) =>
                p.categoria === found.categoria &&
                p.id !== found.id &&
                p.disponible &&
                p.activo
            )
            .slice(0, 4)
      } else {
        console.error('Producto no encontrado. Primeros slugs disponibles:',
            data.productos.slice(0, 10).map((p: Producto) => ({ id: p.id, slug: p.slug, nombre: p.nombre }))
        )
        error.value = `Producto no encontrado`
      }
    } else {
      error.value = 'No se pudieron cargar los productos'
    }
  } catch (err) {
    console.error('Error al cargar producto:', err)
    error.value = err instanceof Error ? err.message : 'Error al cargar el producto'
  } finally {
    loading.value = false
  }
}

const incrementQuantity = () => {
  if (producto.value && quantity.value < producto.value.stock) {
    quantity.value++
  }
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const nextImage = () => {
  if (imagenActualIndex.value < todasLasImagenes.value.length - 1) {
    imagenActualIndex.value++
  } else {
    imagenActualIndex.value = 0 // Volver al inicio
  }
  adjustThumbnailScroll()
}

const prevImage = () => {
  if (imagenActualIndex.value > 0) {
    imagenActualIndex.value--
  } else {
    imagenActualIndex.value = todasLasImagenes.value.length - 1 // Ir al final
  }
  adjustThumbnailScroll()
}

const selectThumbnail = (index: number) => {
  imagenActualIndex.value = index
  pauseAutoplay()
}

const scrollThumbnailsLeft = () => {
  // Moverse una página completa hacia la izquierda
  thumbnailStartIndex.value = Math.max(0, thumbnailStartIndex.value - THUMBNAIL_MAX_VISIBLE)
}

const scrollThumbnailsRight = () => {
  // Moverse una página completa hacia la derecha
  const maxStart = Math.max(0, todasLasImagenes.value.length - THUMBNAIL_MAX_VISIBLE)
  thumbnailStartIndex.value = Math.min(maxStart, thumbnailStartIndex.value + THUMBNAIL_MAX_VISIBLE)
}

const adjustThumbnailScroll = () => {
  // Ajustar el scroll de las miniaturas para que la imagen actual sea visible
  const currentPage = Math.floor(imagenActualIndex.value / THUMBNAIL_MAX_VISIBLE)
  thumbnailStartIndex.value = currentPage * THUMBNAIL_MAX_VISIBLE
}

const startAutoplay = () => {
  if (todasLasImagenes.value.length <= 1) return

  stopAutoplay()
  isAutoplayPaused.value = false

  autoplayInterval.value = setInterval(() => {
    nextImage()
  }, AUTOPLAY_DELAY)
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = null
  }
}

const pauseAutoplay = () => {
  isAutoplayPaused.value = true
  stopAutoplay()
}

const resumeAutoplay = () => {
  if (isAutoplayPaused.value) {
    startAutoplay()
  }
}

const toggleAutoplay = () => {
  if (isAutoplayPaused.value) {
    startAutoplay()
  } else {
    pauseAutoplay()
  }
}

const addToCart = () => {
  if (producto.value) {
    for (let i = 0; i < quantity.value; i++) {
      cartStore.addItem(producto.value)
    }
    quantity.value = 1
  }
}

const goToProduct = (prod: Producto) => {
  router.push(`/producto/${prod.slug}`)
}

watch(() => route.params.productSlug, () => {  // ← Cambiado de slug a productSlug
  if (route.params.productSlug) {
    cargarProducto()
    window.scrollTo(0, 0)
  }
})

onMounted(() => {
  cargarProducto()
})

onUnmounted(() => {
  stopAutoplay()
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

/* Animación de fade-slide para cambio de imagen */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Animación para thumbnails */
.thumbnail-slide-enter-active,
.thumbnail-slide-leave-active {
  transition: all 0.3s ease;
}

.thumbnail-slide-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.thumbnail-slide-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Animación de la barra de progreso del autoplay */
@keyframes autoplay-progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.autoplay-progress {
  animation: autoplay-progress 4s linear infinite;
}
</style>