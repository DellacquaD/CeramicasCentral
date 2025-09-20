<template>
  <div id="app" class="min-h-screen w-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header Component -->
    <HeaderComponent
        :cart-count="cartCount"
        :is-dark="isDark"
        @navigate="handleNavigation"
        @toggle-cart="toggleCart"
        @toggle-search="toggleSearch"
        @toggle-theme="toggleTheme"
    />

    <!-- Hero -->
    <HeroSection/>

    <!-- Categories -->
    <section class="max-w-7xl mx-auto px-8 py-16">
      <h2 class="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Nuestras Categorías
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
            v-for="category in categories"
            :key="category.id"
            @click="selectCategory(category)"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer"
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

    <!-- Notification -->
    <div
        v-if="showNotification"
        class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    >
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HeaderComponent from './components/HeaderComponent.vue'
import HeroSection from "./components/HeroSection.vue";

// State
const searchQuery = ref('')
const isDark = ref(false)
const cartCount = ref(0)
const showNotification = ref(false)
const notificationMessage = ref('')

// Categories
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
    image: 'https://images.unsplash.com/photo-1575204015311-0fe377370780?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 3,
    name: 'Pisos',
    description: 'Porcelanatos, cerámicos y laminados',
    image: 'https://plus.unsplash.com/premium_photo-1711464867441-0fa3ccda942e?q=80&w=1239&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 4,
    name: 'Paredes',
    description: 'Revestimientos y cerámicas para paredes',
    image: 'https://images.unsplash.com/photo-1624524799657-465e72edbcda?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 5,
    name: 'Cocina',
    description: 'Mesadas, backsplash y accesorios',
    image: 'https://images.unsplash.com/photo-1723468356955-a6c59c641a5b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 6,
    name: 'Baño',
    description: 'Griferías, sanitarios y azulejos',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop'
  }
])

// Methods
const handleNavigation = (path) => {
  showToast(`Navegando a: ${path}`)
}

const toggleCart = () => {
  showToast('Carrito toggleado')
}

const toggleSearch = () => {
  showToast('Búsqueda abierta')
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  showToast(`Cambiado a tema ${isDark.value ? 'oscuro' : 'claro'}`)
}

const selectCategory = (category) => {
  showToast(`Seleccionaste: ${category.name}`)
}

const showToast = (message) => {
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

// Initialize theme
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
  document.documentElement.classList.toggle('dark', isDark.value)
}

initTheme()
</script>