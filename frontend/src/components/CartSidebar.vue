<template>
  <!-- Cart Sidebar Overlay -->
  <div class="fixed inset-0 z-50">
    <!-- Background overlay -->
    <div
        @click="$emit('close')"
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
    ></div>

    <!-- Cart sidebar -->
    <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Carrito ({{ items.length }})
        </h2>
        <button
            @click="$emit('close')"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <XMarkIcon class="w-6 h-6 text-gray-500" />
        </button>
      </div>

      <!-- Cart content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="items.length === 0" class="text-center py-12">
          <ShoppingCartIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">Tu carrito está vacío</p>
        </div>

        <div v-else class="space-y-4">
          <div
              v-for="item in items"
              :key="item.id"
              class="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded-lg" />
            <div class="flex-1">
              <h3 class="font-medium text-gray-900 dark:text-white">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">{{ formatPrice(item.price) }}</p>
              <div class="flex items-center mt-2">
                <button
                    @click="$emit('updateQuantity', item.id, item.quantity - 1)"
                    class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  <MinusIcon class="w-4 h-4" />
                </button>
                <span class="mx-3 font-medium">{{ item.quantity }}</span>
                <button
                    @click="$emit('updateQuantity', item.id, item.quantity + 1)"
                    class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  <PlusIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
                @click="$emit('removeItem', item.id)"
                class="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Footer with total and checkout -->
      <div v-if="items.length > 0" class="border-t border-gray-200 dark:border-gray-700 p-6">
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-medium text-gray-900 dark:text-white">Total:</span>
          <span class="text-2xl font-bold text-blue-600">{{ formatPrice(total) }}</span>
        </div>
        <button
            @click="$emit('checkout')"
            class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-4 rounded-xl transition-colors"
        >
          Finalizar por WhatsApp
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  XMarkIcon,
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  currency: {
    type: String,
    default: 'UYU'
  }
})

// Emits
defineEmits(['close', 'updateQuantity', 'removeItem', 'checkout'])

// Computed
const total = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const formatPrice = computed(() => {
  return (price) => {
    const symbol = props.currency === 'USD' ? 'US : UYU' : 'USD'
    return `${symbol} ${price.toLocaleString()}`
  }
})
</script>