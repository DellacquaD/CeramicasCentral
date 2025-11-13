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
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Carrito ({{ cartStore.items.length }})
          </h2>
          <!-- Indicador de cotización compacto -->
          <div v-if="!cotizacionCargando && cotizacionUSD"
               class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            💵 Dólar: ${{ cotizacionUSD.toFixed(2) }}
          </div>
        </div>
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
              v-for="item in itemsConPreciosUYU"
              :key="item.id"
              class="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <img
                :src="item.imagenPrincipal || '/placeholder.png'"
                :alt="item.nombre"
                class="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-900 dark:text-white text-sm">
                {{ item.nombre }}
              </h3>

              <!-- Precios en UYU y USD -->
              <div class="mt-1">
                <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  ${{ formatearPrecio(item.precioCaja) }} 📦
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  ${{ formatearPrecio(item.precioMetro) }}/m²
                </p>
              </div>

              <!-- Cantidad y controles -->
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center space-x-2">
                  <button
                      @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                      class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MinusIcon class="w-4 h-4" />
                  </button>
                  <span class="font-medium text-sm">{{ item.quantity }}</span>
                  <button
                      @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                      :disabled="item.quantity >= item.stock"
                      class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon class="w-4 h-4" />
                  </button>
                </div>

                <button
                    @click="cartStore.removeItem(item.id)"
                    class="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>

              <!-- Subtotal y metros -->
              <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ (item.metrosPorCaja * item.quantity).toFixed(2) }} m²
                  </span>
                  <div class="text-right">
                    <p class="text-sm font-bold text-gray-900 dark:text-white">
                      ${{ formatearPrecio(item.subtotalUYU) }}
                    </p>
                    <p class="text-xs text-gray-400">
                      US$ {{ (item.precio * item.quantity).toFixed(2) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer with total and checkout -->
      <div v-if="!cartStore.isEmpty" class="border-t border-gray-200 dark:border-gray-700 p-6 flex-shrink-0">
        <div class="space-y-3 mb-4">
          <!-- Subtotal -->
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
            <div class="text-right">
              <p class="font-medium text-gray-900 dark:text-white">
                ${{ formatearPrecio(totalPrecioUYU) }}
              </p>
              <p class="text-xs text-gray-400">
                US$ {{ cartStore.totalPrice.toFixed(2) }}
              </p>
            </div>
          </div>

          <!-- Envío -->
          <div class="flex justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Envío:</span>
            <div class="text-right">
              <p class="font-medium text-gray-900 dark:text-white">
                {{ shippingUYU === 0 ? 'Gratis' : `$${formatearPrecio(shippingUYU)}` }}
              </p>
              <p v-if="shippingUYU > 0" class="text-xs text-gray-400">
                US$ {{ shipping.toFixed(2) }}
              </p>
            </div>
          </div>

          <!-- Mensaje envío gratis -->
          <div v-if="shippingUYU === 0" class="text-xs text-green-600 dark:text-green-400">
            ¡Envío gratis! 🎉
          </div>

          <!-- Total -->
          <div class="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
            <span class="text-lg font-medium text-gray-900 dark:text-white">Total:</span>
            <div class="text-right">
              <p class="text-xl font-bold text-blue-600 dark:text-blue-400">
                ${{ formatearPrecio(totalUYU) }}
              </p>
              <p class="text-xs text-gray-400">
                US$ {{ total.toFixed(2) }}
              </p>
            </div>
          </div>

          <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
            {{ cartStore.itemCount }} artículo{{ cartStore.itemCount !== 1 ? 's' : '' }}
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
              to="/cart"
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
import { ref, computed, onMounted } from 'vue'
import {
  XMarkIcon,
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'
import { useCotizacion } from '../services/cotizacionService'

// Emits
const emit = defineEmits<{
  close: []
}>()

// Store
const cartStore = useCartStore()

// Cotización
const cotizacionUSD = ref<number>(42)
const cotizacionCargando = ref<boolean>(true)
const { obtenerCotizacion } = useCotizacion()

// Cargar cotización
const cargarCotizacion = async (): Promise<void> => {
  try {
    cotizacionCargando.value = true
    const valor = await obtenerCotizacion()
    cotizacionUSD.value = valor
    console.log('✅ Cotización cargada en sidebar:', valor)
  } catch (error) {
    console.error('❌ Error al cargar cotización:', error)
  } finally {
    cotizacionCargando.value = false
  }
}

// Función para formatear precios
const formatearPrecio = (precio: number): string => {
  return Math.round(precio).toLocaleString('es-UY')
}

// Computed - Items con precios en UYU
const itemsConPreciosUYU = computed(() => {
  return cartStore.items.map(item => ({
    ...item,
    precioCaja: item.precio * item.metrosPorCaja * cotizacionUSD.value,
    precioMetro: item.precio * cotizacionUSD.value,
    subtotalUYU: item.precio * item.metrosPorCaja * item.quantity * cotizacionUSD.value
  }))
})

// Computed - Total en UYU
const totalPrecioUYU = computed(() => {
  return cartStore.totalPrice * cotizacionUSD.value
})

// Umbral de envío gratis en USD
const shippingThreshold = 5000

// Envío en USD
const shipping = computed(() => {
  return cartStore.totalPrice >= shippingThreshold ? 0 : 20
})

// Envío en UYU
const shippingUYU = computed(() => {
  return shipping.value * cotizacionUSD.value
})

// Total en USD
const total = computed(() => {
  return cartStore.totalPrice + shipping.value
})

// Total en UYU
const totalUYU = computed(() => {
  return totalPrecioUYU.value + shippingUYU.value
})

// Methods
const handleCheckout = () => {
  cartStore.checkout()
  emit('close')
}

// Lifecycle
onMounted(() => {
  cargarCotizacion()
})
</script>