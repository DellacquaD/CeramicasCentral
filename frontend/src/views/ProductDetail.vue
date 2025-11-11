<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronRightIcon, ShoppingCartIcon, MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'
import { useCotizacion } from '../services/cotizacionService'
import type { ProductoCompleto } from '../stores/products'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const productsStore = useProductsStore()

const cotizacionUSD = ref<number>(42)
const cotizacionCargando = ref<boolean>(true)
const { obtenerCotizacion } = useCotizacion()

const producto = ref<ProductoCompleto | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const quantity = ref(1)
const imagenActualIndex = ref(0)
const thumbnailStartIndex = ref(0)
const autoplayInterval = ref<number | null>(null)
const isAutoplayPaused = ref(false)
const productosRelacionados = ref<ProductoCompleto[]>([])

const THUMBNAIL_MAX_VISIBLE = 6
const AUTOPLAY_DELAY = 4000 // 4 segundos

const cargarCotizacion = async (): Promise<void> => {
  try {
    cotizacionCargando.value = true
    const valor = await obtenerCotizacion()
    cotizacionUSD.value = valor
    console.log('✅ Cotización cargada en detalle:', valor)
  } catch (error) {
    console.error('❌ Error al cargar cotización:', error)
  } finally {
    cotizacionCargando.value = false
  }
}

const formatearPrecio = (precio: number): string => {
  return Math.round(precio).toLocaleString('es-UY')
}

const todasLasImagenes = computed(() => {
  if (!producto.value) return []

  // Usar las imágenes del producto (ordenadas por display_order e is_primary)
  return producto.value.images.map(img => img.url).filter(Boolean)
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
  if (!producto.value || !producto.value.precio_metro || !producto.value.metros_por_caja) return 0
  return parseInt((producto.value.precio_metro * producto.value.metros_por_caja).toFixed(2))
})

const precioTotalUYU = computed(() => {
  return precioTotal.value * cotizacionUSD.value
})

const precioMetroUYU = computed(() => {
  if (!producto.value || !producto.value.precio_metro) return 0
  return producto.value.precio_metro * cotizacionUSD.value
})

const stockBadgeClass = computed(() => {
  if (!producto.value || producto.value.stock === null) return 'bg-gray-100 text-gray-800'
  if (producto.value.stock > 50) return 'bg-green-100 text-green-800'
  if (producto.value.stock > 10) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
})

const cargarProducto = async () => {
  loading.value = true
  error.value = null

  try {
    const slug = route.params.productSlug

    if (!slug) {
      error.value = 'No se especificó un producto'
      loading.value = false
      return
    }

    console.log('Buscando producto con slug:', slug)

    // Cargar productos si no están cargados
    if (!productsStore.initialized) {
      await productsStore.cargarProductos()
    }

    // Buscar producto por slug (formato completo con todas las relaciones)
    const found = productsStore.getProductoBySlug(String(slug))

    if (found) {
      console.log('Producto encontrado:', found.nombre)
      producto.value = found
      imagenActualIndex.value = 0
      thumbnailStartIndex.value = 0

      // Iniciar autoplay si hay múltiples imágenes
      if (todasLasImagenes.value.length > 1) {
        startAutoplay()
      }

      // Cargar productos relacionados
      if (found.categories.length > 0) {
        const categoria = found.categories[0]?.slug || ''
        productosRelacionados.value = productsStore
            .getProductosByCategoria(categoria)
            .filter(p => p.id !== found.id)
            .slice(0, 4)
      }
    } else {
      console.error('Producto no encontrado con slug:', slug)
      error.value = 'Producto no encontrado'
    }
  } catch (err) {
    console.error('Error al cargar producto:', err)
    error.value = err instanceof Error ? err.message : 'Error al cargar el producto'
  } finally {
    loading.value = false
  }
}

const incrementQuantity = () => {
  if (producto.value && producto.value.stock !== null && quantity.value < producto.value.stock) {
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
  thumbnailStartIndex.value = Math.max(0, thumbnailStartIndex.value - THUMBNAIL_MAX_VISIBLE)
}

const scrollThumbnailsRight = () => {
  const maxStart = Math.max(0, todasLasImagenes.value.length - THUMBNAIL_MAX_VISIBLE)
  thumbnailStartIndex.value = Math.min(maxStart, thumbnailStartIndex.value + THUMBNAIL_MAX_VISIBLE)
}

const adjustThumbnailScroll = () => {
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

const toggleAutoplay = () => {
  if (isAutoplayPaused.value) {
    startAutoplay()
  } else {
    pauseAutoplay()
  }
}

const addToCart = () => {
  if (producto.value) {
    // Convertir a formato ProductoAPI para el carrito
    const productoParaCarrito = productsStore.transformarProducto(producto.value)

    for (let i = 0; i < quantity.value; i++) {
      cartStore.addItem(productoParaCarrito)
    }
    quantity.value = 1
  }
}

const goToProduct = (prod: ProductoCompleto) => {
  router.push(`/producto/${prod.slug}`)
}

watch(() => route.params.productSlug, () => {
  if (route.params.productSlug) {
    cargarProducto()
    window.scrollTo(0, 0)
  }
})

onMounted(async () => {
  await Promise.all([
    cargarProducto(),
    cargarCotizacion()
  ])
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 py-20 text-center">
      <div class="text-red-600 dark:text-red-400 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-xl font-semibold">{{ error }}</p>
      </div>
      <router-link to="/" class="text-blue-600 dark:text-blue-400 hover:underline">
        Volver al inicio
      </router-link>
    </div>

    <!-- Product Content -->
    <div v-else-if="producto" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumbs -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <router-link to="/" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Inicio
            </router-link>
          </li>
          <ChevronRightIcon class="w-4 h-4 text-gray-400" />
          <li v-if="producto.categories[0]">
            <router-link
                :to="`/categoria/${producto.categories[0].slug}`"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {{ producto.categories[0].name }}
            </router-link>
          </li>
          <ChevronRightIcon class="w-4 h-4 text-gray-400" />
          <li class="text-gray-900 dark:text-white font-medium">
            {{ producto.nombre }}
          </li>
        </ol>
      </nav>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <!-- Gallery -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div class="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden group">
            <img
                v-if="imagenActual"
                :src="imagenActual"
                :alt="producto.nombre"
                class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-6xl">📦</span>
            </div>

            <!-- Navigation Arrows -->
            <button
                v-if="todasLasImagenes.length > 1"
                @click="prevImage"
                class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
                v-if="todasLasImagenes.length > 1"
                @click="nextImage"
                class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Badges -->
            <div class="absolute top-4 left-4 flex flex-col gap-2">
              <span v-if="producto.nuevo" class="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                NUEVO
              </span>
              <span v-if="producto.en_oferta" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                OFERTA
              </span>
              <span v-if="producto.destacado" class="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                DESTACADO
              </span>
            </div>

            <!-- Autoplay Control -->
            <button
                v-if="todasLasImagenes.length > 1"
                @click="toggleAutoplay"
                class="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full"
                :title="isAutoplayPaused ? 'Reproducir' : 'Pausar'"
            >
              <svg v-if="isAutoplayPaused" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          <!-- Thumbnails -->
          <div v-if="todasLasImagenes.length > 1" class="relative">
            <button
                v-if="canScrollThumbnailsLeft"
                @click="scrollThumbnailsLeft"
                class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-1 rounded-full shadow-lg"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div class="grid grid-cols-6 gap-2">
              <button
                  v-for="(img, index) in thumbnailsVisibles"
                  :key="index"
                  @click="selectThumbnail(thumbnailRealIndex(index))"
                  :class="[
                  'aspect-square rounded-lg overflow-hidden border-2 transition-all',
                  thumbnailRealIndex(index) === imagenActualIndex
                    ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                ]"
              >
                <img :src="img" :alt="`Vista ${thumbnailRealIndex(index) + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>

            <button
                v-if="canScrollThumbnailsRight"
                @click="scrollThumbnailsRight"
                class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-1 rounded-full shadow-lg"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <!-- Brand -->
          <div v-if="producto.brand" class="text-sm text-blue-600 dark:text-blue-400 font-semibold">
            {{ producto.brand.name }}
          </div>

          <!-- Title -->
          <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            {{ producto.nombre }}
          </h1>

          <!-- SKU -->
          <p class="text-sm text-gray-600 dark:text-gray-400">
            SKU: {{ producto.sku }}
          </p>

          <!-- Description -->
          <p v-if="producto.descripcion" class="text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ producto.descripcion }}
          </p>

          <!-- Price -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <div v-if="producto.precio_anterior && producto.precio_anterior > precioTotal" class="mb-2">
              <span class="text-lg text-gray-500 line-through">
                ${{ formatearPrecio(producto.precio_anterior * cotizacionUSD) }}
              </span>
              <span class="ml-2 text-sm bg-red-100 text-red-800 px-2 py-1 rounded-lg font-medium">
                -{{ Math.round(((producto.precio_anterior - precioTotal) / producto.precio_anterior) * 100) }}%
              </span>
            </div>

            <div class="flex items-baseline gap-3 mb-2">
              <span class="text-4xl font-bold text-gray-900 dark:text-white">
                ${{ formatearPrecio(precioTotalUYU) }}
              </span>
              <span class="text-lg text-gray-600 dark:text-gray-400">por caja</span>
            </div>

            <p v-if="producto.precio_metro" class="text-gray-600 dark:text-gray-400">
              ${{ formatearPrecio(precioMetroUYU) }} por m²
            </p>
          </div>

          <!-- Specifications -->
          <div class="border-t border-b border-gray-200 dark:border-gray-700 py-6 space-y-4">
            <h3 class="font-semibold text-gray-900 dark:text-white">Especificaciones</h3>

            <dl class="grid grid-cols-2 gap-4 text-sm">
              <div v-if="producto.medidas">
                <dt class="text-gray-600 dark:text-gray-400">Medidas</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ producto.medidas }}</dd>
              </div>

              <div v-if="producto.color">
                <dt class="text-gray-600 dark:text-gray-400">Color</dt>
                <dd class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <span
                      v-if="producto.color.hex_code"
                      :style="{ backgroundColor: producto.color.hex_code }"
                      class="w-4 h-4 rounded-full border border-gray-300"
                  ></span>
                  {{ producto.color.name }}
                </dd>
              </div>

              <div v-if="producto.material">
                <dt class="text-gray-600 dark:text-gray-400">Material</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ producto.material.name }}</dd>
              </div>

              <div v-if="producto.pei">
                <dt class="text-gray-600 dark:text-gray-400">PEI</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ producto.pei }}</dd>
              </div>

              <div v-if="producto.metros_por_caja">
                <dt class="text-gray-600 dark:text-gray-400">M² por caja</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ producto.metros_por_caja }}</dd>
              </div>

              <div v-if="producto.unidad">
                <dt class="text-gray-600 dark:text-gray-400">Unidad</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ producto.unidad }}</dd>
              </div>
            </dl>
          </div>

          <!-- Stock -->
          <div>
            <span :class="['inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', stockBadgeClass]">
              Stock
              <span v-if="producto.stock !== null" class="ml-2">
                ({{ producto.stock }} {{ producto.unidad || 'unidades' }})
              </span>
            </span>
          </div>

          <!-- Quantity & Add to Cart -->
          <div class="flex items-center gap-4">
            <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                  @click="decrementQuantity"
                  class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  :disabled="quantity <= 1"
              >
                <MinusIcon class="w-5 h-5" />
              </button>
              <span class="px-6 font-medium">{{ quantity }}</span>
              <button
                  @click="incrementQuantity"
                  class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  :disabled="producto.stock !== null && quantity >= producto.stock"
              >
                <PlusIcon class="w-5 h-5" />
              </button>
            </div>

            <button
                @click="addToCart"
                :disabled="producto.stock === 0"
                class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCartIcon class="w-5 h-5" />
              Agregar al Carrito
            </button>
          </div>

          <!-- Tags -->
          <div v-if="producto.tags.length > 0" class="flex flex-wrap gap-2">
            <span
                v-for="tag in producto.tags"
                :key="tag.id"
                class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg text-sm"
            >
              {{ tag.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="productosRelacionados.length > 0" class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Productos Relacionados
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
              v-for="prod in productosRelacionados"
              :key="prod.id"
              @click="goToProduct(prod)"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div class="relative aspect-square bg-gray-100 dark:bg-gray-700">
              <img
                  v-if="prod.images[0]"
                  :src="prod.images[0].url"
                  :alt="prod.nombre"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="text-4xl">📦</span>
              </div>
            </div>
            <div class="p-4">
              <p v-if="prod.brand" class="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
                {{ prod.brand.name }}
              </p>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {{ prod.nombre }}
              </h3>
              <p v-if="prod.precio_metro" class="text-lg font-bold text-gray-900 dark:text-white">
                ${{ formatearPrecio((prod.precio_metro * (prod.metros_por_caja || 1)) * cotizacionUSD) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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