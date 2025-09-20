<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <!-- Header with countdown -->
    <section class="bg-gradient-to-r from-red-500 to-orange-500 py-16 mb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-bold text-white mb-4">
          Ofertas Especiales
        </h1>
        <p class="text-xl text-red-100 mb-6">
          Aprovecha estos descuentos por tiempo limitado
        </p>
        <div class="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
          <ClockIcon class="w-6 h-6 text-white mr-2" />
          <span class="text-white font-semibold">
            Ofertas válidas hasta fin de mes
          </span>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Featured offer -->
      <div class="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-8 mb-12 text-center">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            🔥 Oferta del Mes 🔥
          </h2>
          <p class="text-xl text-gray-800 mb-6">
            50% OFF en pisos vinílicos seleccionados
          </p>
          <router-link
              to="/categoria/vinilicos"
              class="inline-flex items-center px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors duration-200"
          >
            Ver Ofertas de Vinílicos
            <ArrowRightIcon class="w-5 h-5 ml-2" />
          </router-link>
        </div>
      </div>

      <!-- Filter tabs -->
      <div class="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg mb-8 w-fit">
        <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeFilter === filter.value
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Offers grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
            v-for="offer in filteredOffers"
            :key="offer.id"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="relative">
            <img
                :src="offer.image"
                :alt="offer.name"
                class="w-full h-48 object-cover"
            />
            <div class="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{{ offer.discount }}%
            </div>
            <div class="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-2 py-1 rounded text-xs font-semibold">
              {{ offer.badge }}
            </div>
          </div>

          <div class="p-6">
            <span class="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">
              {{ offer.category }}
            </span>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-2">
              {{ offer.name }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {{ offer.description }}
            </p>

            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <span class="text-lg text-gray-500 line-through">
                  ${{ offer.originalPrice.toLocaleString() }}
                </span>
                <span class="text-2xl font-bold text-red-600">
                  ${{ offer.salePrice.toLocaleString() }}
                </span>
              </div>
              <span class="text-green-600 font-semibold">
                Ahorras ${{ (offer.originalPrice - offer.salePrice).toLocaleString() }}
              </span>
            </div>

            <div class="space-y-2">
              <button
                  @click="$emit('add-to-cart', offer)"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Agregar al Carrito
              </button>
              <button
                  @click="goToProduct(offer)"
                  class="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Newsletter signup -->
      <div class="mt-16 bg-blue-600 rounded-2xl p-8 text-center">
        <h3 class="text-2xl font-bold text-white mb-4">
          No te pierdas nuestras ofertas
        </h3>
        <p class="text-blue-100 mb-6">
          Suscríbete para recibir las mejores ofertas directamente en tu email
        </p>
        <div class="max-w-md mx-auto flex gap-3">
          <input
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              class="flex-1 px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-blue-300"
          />
          <button
              @click="subscribeNewsletter"
              class="px-6 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Suscribirme
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ClockIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

// Emits
defineEmits(['add-to-cart'])

// State
const activeFilter = ref('all')
const email = ref('')

// Filters
const filters = ref([
  { value: 'all', label: 'Todas' },
  { value: 'pisos', label: 'Pisos' },
  { value: 'paredes', label: 'Paredes' },
  { value: 'bano', label: 'Baño' },
  { value: 'cocina', label: 'Cocina' }
])

// Offers data
const offers = ref([
  {
    id: 1,
    name: 'Piso Vinílico Wood Premium',
    description: 'Piso vinílico imitación madera, resistente al agua',
    originalPrice: 12000,
    salePrice: 6000,
    discount: 50,
    category: 'Vinílicos',
    filterCategory: 'pisos',
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    slug: 'piso-vinilico-wood-premium'
  },
  {
    id: 2,
    name: 'Porcelanato Símil Mármol 60x60',
    description: 'Elegante porcelanato que simula mármol de Carrara',
    originalPrice: 15000,
    salePrice: 11250,
    discount: 25,
    category: 'Pisos',
    filterCategory: 'pisos',
    badge: 'NUEVO',
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop',
    slug: 'porcelanato-simil-marmol-60x60'
  },
  {
    id: 3,
    name: 'Azulejo Subway Metro',
    description: 'Clásico azulejo tipo subway para cocinas modernas',
    originalPrice: 4500,
    salePrice: 3150,
    discount: 30,
    category: 'Revestimientos',
    filterCategory: 'paredes',
    badge: 'OFERTA',
    image: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop',
    slug: 'azulejo-subway-metro'
  },
  {
    id: 4,
    name: 'Grifo Monomando Premium',
    description: 'Grifo de cocina en acero inoxidable con caño extraíble',
    originalPrice: 18000,
    salePrice: 12600,
    discount: 30,
    category: 'Griferías',
    filterCategory: 'bano',
    badge: 'PREMIUM',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
    slug: 'grifo-monomando-premium'
  },
  {
    id: 5,
    name: 'Mesada Granito Negro',
    description: 'Mesada de granito negro absoluto, pulido espejo',
    originalPrice: 35000,
    salePrice: 24500,
    discount: 30,
    category: 'Mesadas',
    filterCategory: 'cocina',
    badge: 'EXCLUSIVA',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    slug: 'mesada-granito-negro'
  },
  {
    id: 6,
    name: 'Set Sanitarios Completo',
    description: 'Inodoro + bidet + lavabo en porcelana blanca',
    originalPrice: 45000,
    salePrice: 31500,
    discount: 30,
    category: 'Sanitarios',
    filterCategory: 'bano',
    badge: 'COMBO',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop',
    slug: 'set-sanitarios-completo'
  }
])

// Computed
const filteredOffers = computed(() => {
  if (activeFilter.value === 'all') return offers.value
  return offers.value.filter(offer => offer.filterCategory === activeFilter.value)
})

// Methods
const goToProduct = (offer) => {
  router.push(`/producto/${offer.slug}`)
}

const subscribeNewsletter = () => {
  if (email.value) {
    console.log('Newsletter subscription:', email.value)
    alert('¡Suscripción exitosa! Recibirás nuestras mejores ofertas.')
    email.value = ''
  }
}
</script>