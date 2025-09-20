<template>
  <section class="max-w-7xl mx-auto px-8 py-16">
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

    <!-- Categories grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
    <div class="text-center mt-16">
      <button
          @click="$emit('viewAll')"
          class="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
      >
        <span class="text-lg">Ver todas las categorías</span>
        <ArrowRightIcon class="w-6 h-6" />
      </button>
    </div>

    <!-- Statistics -->
    <div class="mt-20 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-12">
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
import { ref } from 'vue'
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

// Categories data (desktop-first, más información)
const categories = ref([
  {
    id: 1,
    name: 'Cerámicas',
    description: 'Revestimientos cerámicos de alta calidad para cocina, baño y espacios exteriores',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    productCount: 245,
    tag: 'Más Popular',
    featured: true,
    size: 'large',
    features: ['Antideslizante', 'Resistente al agua', 'Fácil limpieza'],
    priceRange: { min: 890, max: 4500 }
  },
  {
    id: 2,
    name: 'Griferías para Baño',
    description: 'Grifos modernos, mezcladores y accesorios para baño con diseño contemporáneo',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
    productCount: 156,
    tag: 'Premium',
    features: ['Ahorro de agua', 'Garantía 5 años', 'Instalación fácil'],
    priceRange: { min: 2500, max: 15000 }
  },
  {
    id: 3,
    name: 'Porcelanatos',
    description: 'Pisos de porcelanato de alta resistencia con acabados premium',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    productCount: 189,
    tag: 'Resistente',
    features: ['Alta durabilidad', 'Variedad de diseños', 'Bajo mantenimiento'],
    priceRange: { min: 1200, max: 8500 }
  },
  {
    id: 4,
    name: 'Revestimientos',
    description: 'Revestimientos decorativos para interiores y exteriores',
    image: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&h=600&fit=crop',
    productCount: 134,
    tag: 'Decorativo',
    features: ['Diseños únicos', 'Fácil aplicación', 'Resistente a UV'],
    priceRange: { min: 650, max: 3500 }
  },
  {
    id: 5,
    name: 'Loza Sanitaria',
    description: 'Inodoros, lavabos, bidets y accesorios sanitarios de primera calidad',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
    productCount: 98,
    tag: 'Sanitario',
    size: 'large',
    features: ['Descarga dual', 'Diseño ergonómico', 'Fácil instalación'],
    priceRange: { min: 3500, max: 25000 }
  },
  {
    id: 6,
    name: 'Cocinas',
    description: 'Muebles de cocina, mesadas y accesorios para espacios funcionales',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    productCount: 87,
    tag: 'Funcional',
    features: ['Medidas personalizadas', 'Materiales premium', 'Garantía extendida'],
    priceRange: { min: 15000, max: 150000 }
  }
])

// Statistics
const statistics = ref([
  { value: '1000+', label: 'Productos' },
  { value: '50+', label: 'Marcas' },
  { value: '15+', label: 'Años experiencia' },
  { value: '5000+', label: 'Clientes satisfechos' }
])

// Methods
const handleCategorySelect = (category) => {
  emit('categorySelect', category)
}
</script>

<style scoped>
.category-card {
  @apply transform transition-all duration-300;
}

.category-card:hover {
  @apply scale-[1.02];
}
</style>