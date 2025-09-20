<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Carrito de Compras
      </h1>

      <div v-if="items.length === 0" class="text-center py-16">
        <ShoppingCartIcon class="w-24 h-24 text-gray-400 mx-auto mb-6" />
        <h2 class="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
          Tu carrito está vacío
        </h2>
        <p class="text-gray-500 dark:text-gray-500 mb-8">
          Agrega algunos productos para empezar a comprar
        </p>
        <router-link
            to="/productos"
            class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Explorar Productos
          <ArrowRightIcon class="w-5 h-5 ml-2" />
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart items -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Productos ({{ items.length }})
              </h2>
            </div>

            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div
                  v-for="item in items"
                  :key="item.id"
                  class="p-6 flex items-center space-x-4"
              >
                <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-20 h-20 object-cover rounded-lg"
                />

                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    {{ item.name }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Código: {{ item.id }}
                  </p>
                  <p class="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">
                    ${{ item.price.toLocaleString() }}
                  </p>
                </div>

                <div class="flex items-center space-x-3">
                  <button
                      @click="$emit('update-quantity', item.id, item.quantity - 1)"
                      class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <MinusIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>

                  <span class="text-lg font-medium text-gray-900 dark:text-white w-8 text-center">
                    {{ item.quantity }}
                  </span>

                  <button
                      @click="$emit('update-quantity', item.id, item.quantity + 1)"
                      class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <PlusIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <div class="text-right">
                  <p class="text-lg font-bold text-gray-900 dark:text-white">
                    ${{ (item.price * item.quantity).toLocaleString() }}
                  </p>
                  <button
                      @click="$emit('remove-item', item.id)"
                      class="text-red-500 hover:text-red-700 text-sm mt-1"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order summary -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Resumen del Pedido
            </h2>

            <div class="space-y-4 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  ${{ subtotal.toLocaleString() }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Envío</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString()}` }}
                </span>
              </div>

              <div v-if="shipping === 0" class="text-sm text-green-600 dark:text-green-400">
                ¡Envío gratis por compras mayores a $5000!
              </div>

              <hr class="border-gray-200 dark:border-gray-700" />

              <div class="flex justify-between text-lg font-bold">
                <span class="text-gray-900 dark:text-white">Total</span>
                <span class="text-blue-600 dark:text-blue-400">
                  ${{ total.toLocaleString() }}
                </span>
              </div>
            </div>

            <button
                @click="$emit('checkout')"
                class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>Finalizar por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ShoppingCartIcon,
  ArrowRightIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

// Emits
defineEmits(['update-quantity', 'remove-item', 'checkout'])

// Computed
const subtotal = computed(() => {
  return props.items.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const shipping = computed(() => {
  return subtotal.value >= 5000 ? 0 : 500
})

const total = computed(() => {
  return subtotal.value + shipping.value
})
</script>