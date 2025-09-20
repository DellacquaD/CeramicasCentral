<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <div class="flex items-center">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shadow-sm">
<!--              <span class="text-white font-bold text-lg">CC</span>-->
              <img src="../assets/Icono.png" alt="logo" />
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-bold text-gray-900 dark:text-white">Central</span>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ceramicas</span>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex items-center space-x-8">
          <a
              v-for="item in navigationItems"
              :key="item.name"
              href="#"
              @click.prevent="$emit('navigate', item.path)"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-lg transition-colors duration-200 relative group"
          >
            {{ item.name }}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </a>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center space-x-6">
          <!-- Search Icon (for quick access) -->
          <button
              @click="$emit('toggleSearch')"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Buscar productos"
          >
            <MagnifyingGlassIcon class="w-6 h-6" />
          </button>

          <!-- Theme toggle -->
          <button
              @click="emit('toggleTheme')"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              :title="props.isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
          >
            <SunIcon v-if="props.isDark" class="w-6 h-6 text-amber-500 group-hover:text-amber-600 transition-colors" />
            <MoonIcon v-else class="w-6 h-6 text-slate-600 group-hover:text-slate-700 transition-colors" />
          </button>

          <!-- Cart -->
          <button
              @click="$emit('toggleCart')"
              class="relative flex items-center space-x-3 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <ShoppingCartIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span class="font-medium text-lg">Carrito</span>
            <span
                v-if="cartCount > 0"
                class="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold rounded-full min-w-[24px] h-6 flex items-center justify-center px-2 shadow-lg animate-pulse"
            >
              {{ cartCount }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import {
  SunIcon,
  MoonIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

// Props destructuring
const props = defineProps({
  cartCount: {
    type: Number,
    default: 0
  },
  isDark: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['navigate', 'toggleCart', 'toggleSearch', 'toggleTheme'])

// Navigation items
const navigationItems = ref([
  { name: 'Inicio', path: '/' },
  { name: 'Productos', path: '/productos' },
  { name: 'Categorías', path: '/categorias' },
  { name: 'Ofertas', path: '/ofertas' },
  { name: 'Contacto', path: '/contacto' }
])

// Methods - Remove the toggleTheme method and initTheme since they're now handled by parent
// const toggleTheme = () => { ... } - Removed
// const initTheme = () => { ... } - Removed
// initTheme() - Removed
</script>