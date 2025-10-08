<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shadow-sm">
              <img src="../assets/logoVitto.jpg" alt="icon">
            </div>
            <div class="flex flex-col">
              <span class="hidden md:flex text-2xl font-bold text-gray-900 dark:text-white">Cerámicas</span>
              <span class="hidden md:flex text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Central</span>
            </div>
          </div>
        </router-link>

        <!-- Navigation -->
        <nav class="hidden lg:flex items-center space-x-8">
          <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.path"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-lg transition-colors duration-200 relative group"
              active-class="text-blue-600 dark:text-blue-400"
          >
            {{ item.name }}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </router-link>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center space-x-6">
          <!-- Theme toggle -->
          <button
              @click="emit('toggleTheme')"
              class="hidden md:flex rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              :title="props.isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
          >
            <SunIcon v-if="props.isDark" class="w-6 h-6 text-amber-500 group-hover:text-amber-600 transition-colors" />
            <MoonIcon v-else class="w-6 h-6 text-slate-600 group-hover:text-slate-700 transition-colors" />
          </button>

          <!-- Cart Button -->
<!--          <router-link-->
<!--              to="/carrito"-->
<!--              class="relative flex items-center space-x-3 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl group"-->
<!--          >-->
<!--            <ShoppingCartIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />-->
<!--            <span-->
<!--                v-if="cartStore.itemCount > 0"-->
<!--                class="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold rounded-full min-w-[24px] h-6 flex items-center justify-center px-2 shadow-lg animate-pulse"-->
<!--            >-->
<!--              {{ cartStore.itemCount }}-->
<!--            </span>-->
<!--          </router-link>-->
          <button
              @click="emit('toggleCart')"
              class="relative flex items-center space-x-3 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <ShoppingCartIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span
                v-if="cartStore.itemCount > 0"
                class="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold rounded-full min-w-[24px] h-6 flex items-center justify-center px-2 shadow-lg animate-pulse"
            >
              {{ cartStore.itemCount }}
            </span>
          </button>

          <!-- Mobile Menu Button -->
          <div class="flex lg:hidden">
            <button
                @click="emit('toggleCart')"
                class="relative flex items-center space-x-3 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              <ShoppingCartIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span
                  v-if="cartStore.itemCount > 0"
                  class="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold rounded-full min-w-[24px] h-6 flex items-center justify-center px-2 shadow-lg animate-pulse"
              >
              {{ cartStore.itemCount }}
            </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
        v-if="showMobileMenu"
        class="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <div class="px-4 py-4 space-y-2">
        <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.path"
            @click="closeMobileMenu"
            class="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {{ item.name }}
        </router-link>

        <!-- Theme toggle en mobile -->
        <button
            @click="emit('toggleTheme')"
            class="w-full flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <span>Cambiar tema</span>
          <SunIcon v-if="props.isDark" class="w-5 h-5 text-amber-500" />
          <MoonIcon v-else class="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  SunIcon,
  MoonIcon,
  ShoppingCartIcon
} from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'

// Store
const cartStore = useCartStore()

// Props
interface Props {
  isDark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDark: false
})

// Emits
const emit = defineEmits<{
  toggleTheme: []
  toggleCart: []
}>()

// Navigation items
const navigationItems = ref([
  { name: 'Inicio', path: '/' },
  { name: 'Productos', path: '/productos' },
  { name: 'Categorías', path: '/categorias' },
  { name: 'Ofertas', path: '/ofertas' },
  { name: 'Contacto', path: '/contacto' }
])

// Mobile menu state
const showMobileMenu = ref(false)

// const toggleMobileMenu = () => {
//   showMobileMenu.value = !showMobileMenu.value
// }

const closeMobileMenu = () => {
  showMobileMenu.value = false
}
</script>