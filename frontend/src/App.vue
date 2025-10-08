<template>
  <div id="app" class="min-h-screen w-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header Component -->
<!--    <HeaderComponent-->
<!--        :is-dark="isDark"-->
<!--        @toggle-theme="toggleTheme"-->
<!--    />-->

    <HeaderComponent
        :is-dark="isDark"
        @toggle-theme="toggleTheme"
        @toggle-cart="toggleCart"
    />

    <!-- Main Router View -->
    <main>
      <router-view />
    </main>

    <!-- Footer Component -->
    <FooterComponent
        :currency="currentCurrency"
        @navigate="handleNavigation"
        @select-category="handleCategorySelect"
        @set-currency="setCurrency"
    />

    <!-- Cart Sidebar (when toggled) -->
    <CartSidebar
        v-if="showCart"
        :currency="currentCurrency"
        @close="toggleCart"
    />

    <!-- Search Modal (when toggled) -->
    <SearchModal
        v-if="showSearchModal"
        @close="toggleSearch"
        @search="handleSearch"
    />

    <!-- Notification Toast (simplificado, el store tiene su propio sistema) -->
    <div
        v-if="notification.show"
        :class="[
        'fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transition-all duration-300 transform',
        notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white',
        notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      ]"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
import CartSidebar from './components/CartSidebar.vue'
import SearchModal from './components/SearchModal.vue'
import { useCartStore } from './stores/cart'

// Router y Store
const router = useRouter()
const cartStore = useCartStore()

// State (solo lo que no está en el store)
const currentCurrency = ref('UYU')
const isDark = ref(false)
const showCart = ref(false)
const showSearchModal = ref(false)

// Notification system (local para notificaciones de la app)
const notification = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

// Methods
const handleNavigation = (path: string) => {
  router.push(path)
}

const handleSearch = (searchData: any) => {
  const query = typeof searchData === 'string' ? searchData : searchData.query || searchData
  router.push({
    name: 'Search',
    query: {
      q: query,
      categoria: searchData.category || ''
    }
  })
  showSearchModal.value = false
  showNotification(`Buscando: ${query}`)
}

const handleCategorySelect = (category: any) => {
  const categorySlug = category.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')

  router.push(`/categoria/${categorySlug}`)
  showNotification(`Explorando ${category.name}`)
}

const toggleCart = () => {
  showCart.value = !showCart.value
}

const toggleSearch = () => {
  showSearchModal.value = !showSearchModal.value
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  showNotification(`Cambiado a tema ${isDark.value ? 'oscuro' : 'claro'}`)
}

const setCurrency = (currency: string) => {
  currentCurrency.value = currency
  localStorage.setItem('currency', currency)
  showNotification(`Moneda cambiada a ${currency}`)
}

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notification.message = message
  notification.type = type
  notification.show = true

  setTimeout(() => {
    notification.show = false
  }, 3000)
}

// Initialize theme
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
  document.documentElement.classList.toggle('dark', isDark.value)
}

// Initialize currency
const initCurrency = () => {
  const savedCurrency = localStorage.getItem('currency')
  if (savedCurrency) {
    currentCurrency.value = savedCurrency
  }
}

// Initialize all on mount
onMounted(() => {
  initTheme()
  initCurrency()
  // El carrito se carga automáticamente desde el store
  cartStore.loadFromLocalStorage()
})
</script>

<style>
/* Global styles */
@import './style.css';

/* Smooth transitions for theme changes */
* {
  transition-property: background-color, border-color, color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Animaciones para notificaciones */
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

.animate-slide-out {
  animation: slide-out 0.3s ease-in;
}
</style>