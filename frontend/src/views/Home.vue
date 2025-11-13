<template>
  <div>
    <!-- Hero Section -->
    <HeroSection />

    <!-- Stats Bar -->
<!--    <section class="bg-gradient-to-r from-blue-600 to-blue-800 py-8">-->
<!--      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">-->
<!--        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">-->
<!--          <div class="text-center">-->
<!--            <div class="text-3xl sm:text-4xl font-bold text-white mb-1">-->
<!--              {{ totalProducts }}+-->
<!--            </div>-->
<!--            <div class="text-blue-100 text-sm sm:text-base">Productos</div>-->
<!--          </div>-->
<!--          <div class="text-center">-->
<!--            <div class="text-3xl sm:text-4xl font-bold text-white mb-1">-->
<!--              {{ categoriesWithProducts.length }}-->
<!--            </div>-->
<!--            <div class="text-blue-100 text-sm sm:text-base">Categorías</div>-->
<!--          </div>-->
<!--          <div class="text-center">-->
<!--            <div class="text-3xl sm:text-4xl font-bold text-white mb-1">-->
<!--              {{ totalBrands }}+-->
<!--            </div>-->
<!--            <div class="text-blue-100 text-sm sm:text-base">Marcas</div>-->
<!--          </div>-->
<!--          <div class="text-center">-->
<!--            <div class="text-3xl sm:text-4xl font-bold text-white mb-1">15</div>-->
<!--            <div class="text-blue-100 text-sm sm:text-base">Años</div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </section>-->

    <!-- Categories Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Nuestras <span class="text-blue-600">Categorías</span>
        </h2>
        <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Explora nuestra amplia gama de productos para construcción y decoración
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <div
            v-for="category in categoriesWithProducts"
            :key="category.id"
            @click="goToCategory(category.slug)"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group"
        >
          <div class="relative h-56 overflow-hidden">
            <img
                v-if="category.image_url"
                :src="category.image_url"
                :alt="category.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span class="text-7xl group-hover:scale-110 transition-transform duration-300">
                {{ getCategoryIcon(category.name) }}
              </span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4">
              <h3 class="text-xl font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">
                {{ category.name }}
              </h3>
              <p class="text-gray-200 text-sm flex items-center gap-1">
                <span>📦</span>
                {{ category.productCount }} productos
              </p>
            </div>
          </div>
          <div class="p-4 bg-gradient-to-r from-blue-50 to-white dark:from-gray-700 dark:to-gray-800">
            <div class="flex items-center justify-between">
              <span class="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                Explorar productos
              </span>
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Categories Button -->
      <div class="text-center mt-12">
        <router-link
            to="/categories"
            class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span>Ver todas las categorías</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </router-link>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="bg-gray-100 dark:bg-gray-800 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Productos <span class="text-blue-600">Destacados</span>
          </h2>
          <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
            Los mejores productos seleccionados para ti
          </p>
        </div>

        <div v-if="productosDestacados.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
              v-for="producto in productosDestacados"
              :key="producto.id"
              @click="goToProduct(producto.slug)"
              class="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div class="relative h-56 overflow-hidden">
              <img
                  v-if="producto.imagenPrincipal"
                  :src="producto.imagenPrincipal"
                  :alt="producto.nombre"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <span class="text-6xl">📦</span>
              </div>

              <!-- Badges -->
              <div class="absolute top-3 left-3 flex flex-col gap-2">
                <span v-if="producto.nuevo" class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  NUEVO
                </span>
                <span v-if="producto.enOferta" class="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  OFERTA
                </span>
              </div>
            </div>

            <div class="p-4">
              <p class="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1 uppercase">
                {{ producto.marca }}
              </p>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 h-12">
                {{ producto.nombre }}
              </h3>
              <div class="flex items-baseline gap-2">
                <span class="text-xl font-bold text-blue-600 dark:text-blue-400">
                  ${{ formatearPrecio(producto.precioPorCajaUYU) }}
                </span>
                <span class="text-sm text-gray-500">caja</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Ver todos los productos button -->
        <div class="text-center mt-12">
          <router-link
              to="/products"
              class="inline-flex items-center gap-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span>Ver todos los productos</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features section -->
    <section class="bg-white dark:bg-gray-900 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Por qué elegir <span class="text-blue-600">Cerámicas Central</span>?
          </h2>
          <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Somos líderes en el sector con la mejor calidad, precios competitivos y un servicio excepcional
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
              v-for="feature in features"
              :key="feature.title"
              class="text-center group"
          >
            <div class="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
              <component :is="feature.icon" class="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          ¿Necesitás ayuda con tu proyecto?
        </h2>
        <p class="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Nuestro equipo de expertos está listo para asesorarte y ayudarte a encontrar los productos perfectos
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
              to="/contact"
              class="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contactanos
          </router-link>
          <a href="tel:+59899123456"
          class="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-xl transition-all duration-300"
          >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Llamanos
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'
import HeroSection from '../components/HeroSection.vue'
import { useProducts } from '../composables/useProducts'
import type { ProductoAPIUYU } from '../stores/products'

const router = useRouter()

// Usar el composable
const { store, productos, categorias, loading, cargarSiEsNecesario } = useProducts()

// Categorías con conteo de productos
const categoriesWithProducts = computed(() => {
  return categorias.value
      .map(category => {
        const productCount = productos.value.filter(producto =>
            producto.categoria.some(cat => cat.toLowerCase() === category.name.toLowerCase())
        ).length

        return {
          ...category,
          productCount
        }
      })
      .filter(cat => cat.productCount > 0)
      .sort((a, b) => {
        if (a.display_order !== null && b.display_order !== null) {
          return a.display_order - b.display_order
        }
        return b.productCount - a.productCount
      })
      .slice(0, 6) // Mostrar solo las primeras 6
})

// Productos destacados
const productosDestacados = computed((): ProductoAPIUYU[] => {
  return productos.value
      .filter(p => p.destacado || p.enOferta || p.nuevo)
      .slice(0, 8)
})

// Stats
const totalProducts = computed(() => productos.value.length)
const totalBrands = computed(() => store.brands.length)

const formatearPrecio = (precio: number): string => {
  return Math.round(precio).toLocaleString('es-UY')
}

const getCategoryIcon = (categoryName: string): string => {
  const icons: Record<string, string> = {
    'pisos': '🏠',
    'revestimientos': '🧱',
    'cocina': '🍳',
    'baño': '🚿',
    'grifería': '🚰',
    'muebles': '🪑',
    'accesorios': '🔧'
  }
  return icons[categoryName.toLowerCase()] || '📦'
}

const goToCategory = (slug: string) => {
  router.push(`/categories/${slug}`)
}

const goToProduct = (slug: string) => {
  router.push(`/product/${slug}`)
}

// Features data
const features = [
  {
    icon: TruckIcon,
    title: 'Envío Gratuito',
    description: 'Envío gratis en compras mayores a $5000. Entrega rápida en todo el país.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Garantía Extendida',
    description: 'Productos garantizados. Respaldamos la calidad de todos nuestros productos.'
  },
  {
    icon: CreditCardIcon,
    title: 'Financiación',
    description: 'Pagá en cuotas sin interés. Aceptamos todas las tarjetas de crédito.'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Asesoramiento',
    description: 'Equipo especializado para ayudarte a elegir el producto perfecto.'
  }
]

onMounted(async () => {
  await cargarSiEsNecesario()
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