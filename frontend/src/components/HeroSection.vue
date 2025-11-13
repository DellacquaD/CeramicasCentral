<template>
  <section class="relative overflow-hidden bg-gray-100 dark:bg-gray-900 h-[350px] sm:h-[400px] lg:h-[450px]">
    <!-- Loading Splash -->
    <transition name="splash">
      <div
          v-if="isLoading"
          class="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-blue-900"
      >
        <div class="text-center px-4">
          <div class="mb-6 relative">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-24 h-24 bg-blue-500/20 rounded-full animate-ping"></div>
            </div>
            <div class="relative text-7xl animate-bounce-slow">🏠</div>
          </div>

          <h1 class="text-4xl sm:text-5xl font-bold text-white mb-3 animate-fade-in-up">
            Cerámicas <span class="text-blue-400">Central</span>
          </h1>

          <p class="text-lg text-blue-200 mb-6 animate-fade-in-up animation-delay-300">
            Transformando espacios, creando hogares
          </p>

          <div class="flex items-center justify-center gap-2 animate-fade-in-up animation-delay-500">
            <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-200"></div>
            <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-400"></div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Main Slider -->
    <div v-show="!isLoading" class="absolute inset-0">
      <!-- Slides -->
      <transition-group name="fade">
        <div
            v-for="(slide, index) in slides"
            :key="`slide-${index}`"
            v-show="currentSlide === index"
            class="absolute inset-0"
        >
          <!-- Grid de 2 productos -->
          <div v-if="slide.left && slide.right" class="relative h-full grid grid-cols-2">
            <!-- Producto Izquierdo -->
            <div class="relative overflow-hidden">
              <div class="absolute inset-0">
                <img
                    v-if="slide.left.imagenPrincipal"
                    :src="slide.left.imagenPrincipal"
                    :alt="slide.left.nombre"
                    class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <div class="text-6xl">📦</div>
                </div>
                <div class="absolute inset-0 bg-black/50"></div>
              </div>

              <div class="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div class="text-center max-w-md">
                  <div class="flex justify-center gap-2 mb-3">
                    <span v-if="slide.left.nuevo" class="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold">NUEVO</span>
                    <span v-if="slide.left.enOferta" class="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold">OFERTA</span>
                  </div>

                  <p class="text-blue-400 text-sm font-bold mb-2 uppercase">{{ slide.left.marca }}</p>
                  <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight line-clamp-2">
                    {{ slide.left.nombre }}
                  </h2>

                  <div class="mb-4">
                    <!-- ✅ Precio anterior con cálculo proporcional -->
                    <div v-if="slide.left.precioAnterior && slide.left.precioAnterior > 0" class="flex items-center justify-center gap-2 mb-1">
                      <span class="text-lg text-red-300 line-through">
                        ${{ formatearPrecio(calcularPrecioAnteriorUYU(slide.left)) }}
                      </span>
                      <span class="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                        -{{ calcularDescuento(slide.left) }}%
                      </span>
                    </div>

                    <!-- ✅ Precio por caja en UYU -->
                    <div class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1">
                      ${{ formatearPrecio(slide.left.precioPorCajaUYU) }}
                      <span class="text-2xl sm:text-3xl lg:text-4xl">📦</span>
                    </div>

                    <!-- ✅ Precio por metro en UYU -->
                    <p class="text-white/80 text-sm">
                      ${{ formatearPrecio(slide.left.precioMetroUYU) }} m²
                    </p>
                  </div>

                  <button
                      @click="viewProduct(slide.left)"
                      class="bg-white hover:bg-blue-50 text-gray-900 font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    Ver oferta
                  </button>
                </div>
              </div>
            </div>

            <!-- Producto Derecho -->
            <div class="relative overflow-hidden">
              <div class="absolute inset-0">
                <img
                    v-if="slide.right.imagenPrincipal"
                    :src="slide.right.imagenPrincipal"
                    :alt="slide.right.nombre"
                    class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                  <div class="text-6xl">📦</div>
                </div>
                <div class="absolute inset-0 bg-black/50"></div>
              </div>

              <div class="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div class="text-center max-w-md">
                  <div class="flex justify-center gap-2 mb-3">
                    <span v-if="slide.right.nuevo" class="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold">NUEVO</span>
                    <span v-if="slide.right.enOferta" class="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold">OFERTA</span>
                  </div>

                  <p class="text-blue-400 text-sm font-bold mb-2 uppercase">{{ slide.right.marca }}</p>
                  <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight line-clamp-2">
                    {{ slide.right.nombre }}
                  </h2>

                  <div class="mb-4">
                    <!-- ✅ Precio anterior con cálculo proporcional -->
                    <div v-if="slide.right.precioAnterior && slide.right.precioAnterior > 0" class="flex items-center justify-center gap-2 mb-1">
                      <span class="text-lg text-red-300 line-through">
                        ${{ formatearPrecio(calcularPrecioAnteriorUYU(slide.right)) }}
                      </span>
                      <span class="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                        -{{ calcularDescuento(slide.right) }}%
                      </span>
                    </div>

                    <!-- ✅ Precio por caja en UYU -->
                    <div class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1">
                      ${{ formatearPrecio(slide.right.precioPorCajaUYU) }}
                      <span class="text-2xl sm:text-3xl lg:text-4xl">📦</span>
                    </div>

                    <!-- ✅ Precio por metro en UYU -->
                    <p class="text-white/80 text-sm">
                      ${{ formatearPrecio(slide.right.precioMetroUYU) }} m²
                    </p>
                  </div>

                  <button
                      @click="viewProduct(slide.right)"
                      class="bg-white hover:bg-blue-50 text-gray-900 font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    Ver oferta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Navigation Arrows -->
      <button
          @click="prevSlide"
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg z-10"
          aria-label="Anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
          @click="nextSlide"
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg z-10"
          aria-label="Siguiente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Dots Navigation -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        <button
            v-for="(_slide, index) in slides"
            :key="`dot-${index}`"
            @click="goToSlide(index)"
            :class="[
              'transition-all duration-300',
              currentSlide === index
                ? 'w-8 h-2.5 bg-white rounded-full'
                : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/75 rounded-full'
            ]"
            :aria-label="`Ir a slide ${index + 1}`"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import type { ProductoAPIUYU } from '@/stores/products'

const router = useRouter()

// ✅ Usar el composable (ya trae productos con precios en UYU)
const { store, productos, cargarSiEsNecesario } = useProducts()

const currentSlide = ref(0)
const autoplayInterval = ref<number | null>(null)
const isLoading = ref(true)

// ✅ Computed con productos que ya tienen precios en UYU
const slides = computed(() => {
  // Filtrar productos en oferta o nuevos
  let productosDestacados = productos.value.filter(p => p.enOferta || p.nuevo)

  // Si no hay suficientes, agregar otros productos
  if (productosDestacados.length < 6) {
    const adicionales = productos.value
        .filter(p => !productosDestacados.includes(p))
        .slice(0, 6 - productosDestacados.length)
    productosDestacados = [...productosDestacados, ...adicionales]
  }

  // Crear slides de 2 productos
  const slidesArray: Array<{ left: ProductoAPIUYU; right: ProductoAPIUYU }> = []
  for (let i = 0; i < productosDestacados.length; i += 2) {
    const left = productosDestacados[i]
    const right = productosDestacados[i + 1]

    if (left && right) {
      slidesArray.push({
        left,
        right
      })
    }
  }

  return slidesArray.slice(0, 5)
})

const formatearPrecio = (precio: number): string => {
  return Math.round(precio).toLocaleString('es-UY')
}

// ✅ Calcular precio anterior en UYU (proporcional)
const calcularPrecioAnteriorUYU = (product: ProductoAPIUYU): number => {
  if (!product.precioAnterior) return 0

  // Calcular ratio entre precio anterior y precio actual
  const ratio = product.precioAnterior / product.precio

  // Aplicar el mismo ratio al precio por caja en UYU
  return product.precioPorCajaUYU * ratio
}

// ✅ Calcular descuento basado en precios USD originales
const calcularDescuento = (product: ProductoAPIUYU): number => {
  if (!product.precioAnterior || product.precioAnterior <= 0) return 0

  const precioActual = product.precioMetro && product.metrosPorCaja
      ? product.precioMetro * product.metrosPorCaja
      : product.precio

  const descuento = ((product.precioAnterior - precioActual) / product.precioAnterior) * 100
  return Math.round(descuento)
}

const nextSlide = (): void => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
  resetAutoplay()
}

const prevSlide = (): void => {
  currentSlide.value = currentSlide.value === 0
      ? slides.value.length - 1
      : currentSlide.value - 1
  resetAutoplay()
}

const goToSlide = (index: number): void => {
  currentSlide.value = index
  resetAutoplay()
}

const startAutoplay = (): void => {
  autoplayInterval.value = window.setInterval(() => {
    nextSlide()
  }, 5000)
}

const stopAutoplay = (): void => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = null
  }
}

const resetAutoplay = (): void => {
  stopAutoplay()
  startAutoplay()
}

const viewProduct = (product: ProductoAPIUYU): void => {
  router.push(`/product/${product.slug}`)
}

// ✅ Lifecycle simplificado
onMounted(async () => {
  // Cargar productos y cotización
  await cargarSiEsNecesario()

  // Ocultar splash después de 1.5 segundos
  setTimeout(() => {
    isLoading.value = false

    // Iniciar autoplay
    if (slides.value.length > 0) {
      setTimeout(() => {
        startAutoplay()
      }, 100)
    }
  }, 1500)
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Splash animations */
.splash-enter-active {
  transition: opacity 0.5s ease;
}

.splash-leave-active {
  transition: opacity 0.8s ease;
}

.splash-enter-from,
.splash-leave-to {
  opacity: 0;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}
</style>