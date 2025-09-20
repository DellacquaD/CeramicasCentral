<template>
  <div>
    <!-- Hero Section -->
    <HeroSection @search="$emit('search', $event)" />

    <!-- Categories Grid -->
    <section class="max-w-7xl mx-auto px-8 py-16">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Nuestras <span class="text-blue-600">Categorías</span>
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Explora nuestra amplia gama de productos para construcción y decoración.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
            v-for="category in categories"
            :key="category.id"
            @click="$emit('category-select', category)"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
        >
          <img
              :src="category.image"
              :alt="category.name"
              class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ category.name }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ category.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features section -->
    <section class="bg-white dark:bg-gray-800 py-20">
      <div class="max-w-7xl mx-auto px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            ¿Por qué elegir <span class="text-blue-600">Products</span>?
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Somos líderes en el sector con la mejor calidad, precios competitivos y un servicio excepcional.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
              v-for="feature in features"
              :key="feature.title"
              class="text-center group hover:scale-105 transition-transform duration-300"
          >
            <div class="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <component :is="feature.icon" class="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'
import HeroSection from '../components/HeroSection.vue'

// Emits
defineEmits(['search', 'category-select'])

// Categories data
const categories = ref([
  {
    id: 1,
    name: 'Ofertas',
    description: 'Productos con descuentos especiales',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    name: 'Vinílicos',
    description: 'Pisos vinílicos de alta durabilidad',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    name: 'Pisos',
    description: 'Porcelanatos, cerámicos y laminados',
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    name: 'Paredes',
    description: 'Revestimientos y cerámicas para paredes',
    image: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop'
  },
  {
    id: 5,
    name: 'Cocina',
    description: 'Mesadas, backsplash y accesorios',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
  },
  {
    id: 6,
    name: 'Baño',
    description: 'Griferías, sanitarios y azulejos',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop'
  }
])

// Features data
const features = ref([
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
])
</script>