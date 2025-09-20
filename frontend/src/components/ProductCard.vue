<template>
  <div
      @click="$emit('select', category)"
      class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
  >
    <!-- Image container -->
    <div class="relative h-80 overflow-hidden">
      <img
          :src="category.image"
          :alt="category.name"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
      />

      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

      <!-- Product count badge -->
      <div class="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
        <span class="text-sm font-semibold text-gray-900 dark:text-white">
          {{ category.productCount }}+ productos
        </span>
      </div>

      <!-- Category tag -->
      <div class="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
        <span class="text-xs font-medium text-white uppercase tracking-wide">
          {{ category.tag || 'Categoría' }}
        </span>
      </div>

      <!-- Content overlay -->
      <div class="absolute bottom-0 left-0 right-0 p-6">
        <h3 class="text-3xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
          {{ category.name }}
        </h3>
        <p class="text-gray-200 text-base leading-relaxed mb-4">
          {{ category.description }}
        </p>

        <!-- Features list -->
        <div class="flex flex-wrap gap-2 mb-4" v-if="category.features">
          <span
              v-for="feature in category.features"
              :key="feature"
              class="px-2 py-1 bg-white/20 rounded-md text-xs text-white font-medium"
          >
            {{ feature }}
          </span>
        </div>

        <!-- Action button -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-blue-200 text-sm font-medium">Ver productos</span>
            <ArrowRightIcon class="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
          </div>

          <!-- Price range if available -->
          <div v-if="category.priceRange" class="text-right">
            <span class="text-white text-sm font-semibold">
              Desde {{ formatPrice(category.priceRange.min) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Hover effect border -->
    <div class="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-2xl transition-all duration-300 pointer-events-none"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  currency: {
    type: String,
    default: 'UYU'
  }
})

// Emits
defineEmits(['select'])

// Computed
const formatPrice = computed(() => {
  return (price) => {
    const symbol = props.currency === 'USD' ? 'US$' : '$'
    return `${symbol} ${price.toLocaleString()}`
  }
})
</script>