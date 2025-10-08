<template>
  <!-- Cart Sidebar Overlay -->
  <div class="fixed inset-0 z-50">
    <!-- Background overlay -->
    <div
        @click="$emit('close')"
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
    ></div>

    <!-- Cart sidebar -->
    <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Carrito ({{ cartStore.items.length }})
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
        <div v-if="cartStore.isEmpty" class="text-center py-12">
          <ShoppingCartIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400 mb-4">Tu carrito está vacío</p>
          <button
              @click="$emit('close')"
              class="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Continuar comprando
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <img
                :src="item.imagenPrincipal || '/placeholder.png'"
                :alt="item.nombre"
                class="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ item.nombre }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.marca }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {{ formatPrice(item.precio) }}
              </p>
              <div class="flex items-center mt-2">
                <button
                    @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                    class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MinusIcon class="w-4 h-4" />
                </button>
                <span class="mx-3 font-medium">{{ item.quantity }}</span>
                <button
                    @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                    :disabled="item.quantity >= item.stock"
                    class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlusIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
                @click="cartStore.removeItem(item.id)"
                class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex-shrink-0"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Footer with total and checkout -->
      <div v-if="!cartStore.isEmpty" class="border-t border-gray-200 dark:border-gray-700 p-6 flex-shrink-0">
        <div class="space-y-3 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ formatPrice(cartStore.totalPrice) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Artículos:</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ cartStore.itemCount }}</span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <span class="text-lg font-medium text-gray-900 dark:text-white">Total:</span>
            <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ formatPrice(total) }}</span>
          </div>
        </div>

        <div class="space-y-3">
          <button
              @click="handleCheckout"
              class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            Finalizar por WhatsApp
          </button>

          <router-link
              to="/carrito"
              @click="$emit('close')"
              class="block w-full text-center border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-3 rounded-xl transition-colors"
          >
            Ver carrito completo
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  XMarkIcon,
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'

// Props
interface Props {
  currency?: string
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'UYU'
})

// Emits
const emit = defineEmits<{
  close: []
}>()

// Store
const cartStore = useCartStore()

// Computed
const shipping = computed(() => {
  return cartStore.totalPrice >= 5000 ? 0 : 500
})

const total = computed(() => {
  return cartStore.totalPrice + shipping.value
})

const formatPrice = (price: number): string => {
  const symbol = props.currency === 'USD' ? 'US$' : '$'
  return `${symbol} ${price.toLocaleString('es-UY')}`
}

// Methods
const handleCheckout = () => {
  cartStore.checkout()
  emit('close')
}
</script>