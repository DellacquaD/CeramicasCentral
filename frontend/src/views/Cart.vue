<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Carrito de Compras
        </h1>

        <!-- Indicador de cotización -->
        <div v-if="!cotizacionCargando && cotizacionUSD"
             class="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
          <span class="text-gray-600 dark:text-gray-400">
            💵 Dólar:
          </span>
          <span class="font-semibold text-blue-600 dark:text-blue-400">
            ${{ cotizacionUSD.toFixed(2) }} UYU
          </span>
        </div>
      </div>

      <div v-if="cartStore.isEmpty" class="text-center py-16">
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
                Productos ({{ cartStore.items.length }})
              </h2>
            </div>

            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div
                  v-for="item in itemsConPreciosUYU"
                  :key="item.id"
                  class="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <img
                    :src="item.imagenPrincipal || '/placeholder.png'"
                    :alt="item.nombre"
                    class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />

                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    {{ item.nombre }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Stock: {{ item.stock }} {{ item.unidad }}
                  </p>

                  <!-- Precio en UYU y USD -->
                  <div class="mt-2">
                    <p class="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ${{ formatearPrecio(item.precioCaja) }} 📦
                    </p>
                    <p>
                      ${{ formatearPrecio(item.precioMetro) }} m2
                    </p>
                  </div>
                </div>
                <div>
                  <div class="flex items-center space-x-3">
                    <button
                        @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                        class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <MinusIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>

                    <span class="text-lg font-medium text-gray-900 dark:text-white w-12 text-center">
                    {{ item.quantity }}
                  </span>

                    <button
                        @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                        :disabled="item.quantity >= item.stock"
                        class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <PlusIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                  <p>
                    {{item.quantity}} 📦 = {{ (item.metrosPorCaja * item.quantity).toFixed(2) }} m2
                  </p>
                </div>

                <div class="text-right flex-shrink-0">
                  <!-- Subtotal en UYU -->
                  <p class="text-lg font-bold text-gray-900 dark:text-white">
<!--                    ${{ (formatearPrecio(item.subtotalUYU) * item.quantity).toFixed(2) }} UYU-->
                    ${{ item.subtotalUYU.toFixed(0) }} UYU
                  </p>
                  <p class="text-xs text-gray-400">
                    US$ {{ (item.precio * item.quantity).toFixed(2) }}
                  </p>
                  <button
                      @click="cartStore.removeItem(item.id)"
                      class="text-red-500 hover:text-red-700 text-sm mt-1 flex items-center gap-1"
                  >
                    <TrashIcon class="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón limpiar carrito -->
          <div class="mt-4 flex justify-end">
            <button
                @click="handleClearCart"
                class="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-sm font-medium"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        <!-- Order summary -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Resumen del Pedido
            </h2>

            <div class="space-y-4 mb-6">
              <!-- Subtotal en UYU -->
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                <div class="text-right">
                  <p class="font-medium text-gray-900 dark:text-white">
                    ${{ formatearPrecio(totalPrecioUYU) }} UYU
                  </p>
                  <p class="text-xs text-gray-400">
                    US$ {{ cartStore.totalPrice.toFixed(2) }}
                  </p>
                </div>
              </div>

              <!-- Envío en UYU -->
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Envío</span>
                <div class="text-right">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ shippingUYU === 0 ? 'Gratis' : `$${formatearPrecio(shippingUYU)} UYU` }}
                  </p>
                  <p v-if="shippingUYU > 0" class="text-xs text-gray-400">
                    US$ {{ shipping.toFixed(2) }}
                  </p>
                </div>
              </div>

              <div v-if="shippingUYU === 0" class="text-sm text-green-600 dark:text-green-400">
                ¡Envío gratis por compras mayores a ${{ formatearPrecio(shippingThresholdUYU) }}!
              </div>

              <hr class="border-gray-200 dark:border-gray-700" />

              <!-- Total en UYU -->
              <div class="flex justify-between text-lg font-bold">
                <span class="text-gray-900 dark:text-white">Total</span>
                <div class="text-right">
                  <p class="text-blue-600 dark:text-blue-400">
                    ${{ formatearPrecio(totalUYU) }} UYU
                  </p>
                  <p class="text-sm text-gray-400 font-normal">
                    US$ {{ total.toFixed(2) }}
                  </p>
                </div>
              </div>

              <div class="text-xs text-gray-500 dark:text-gray-400">
                Total de artículos: {{ cartStore.itemCount }}
              </div>
            </div>

            <button
                @click="cartStore.checkout()"
                class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>Finalizar por WhatsApp</span>
            </button>

            <p class="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              Al hacer clic, serás redirigido a WhatsApp con tu pedido
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ShoppingCartIcon,
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'
import { useCotizacion } from '../services/cotizacionService'

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
    console.log('✅ Cotización cargada en carrito:', valor)
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
const shippingThresholdUYU = computed(() => shippingThreshold * cotizacionUSD.value)

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
const handleClearCart = () => {
  if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
    cartStore.clearCart()
  }
}

// Lifecycle
onMounted(() => {
  cargarCotizacion()
})
</script>