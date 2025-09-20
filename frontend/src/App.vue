<template>
  <div id="app" class="min-h-screen w-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header Component -->
    <HeaderComponent
        :cart-count="cartCount"
        :is-dark="isDark"
        @toggle-cart="toggleCart"
        @toggle-search="toggleSearch"
        @toggle-theme="toggleTheme"
    />

    <!-- Main Router View -->
    <main>
      <router-view
          @search="handleSearch"
          @category-select="handleCategorySelect"
          @add-to-cart="addToCart"
          @remove-from-cart="removeFromCart"
          @update-quantity="updateCartQuantity"
          @remove-item="removeFromCart"
          @checkout="handleCheckout"
          :items="cartItems"
      />
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
        :items="cartItems"
        :currency="currentCurrency"
        @close="toggleCart"
        @update-quantity="updateCartQuantity"
        @remove-item="removeFromCart"
        @checkout="handleCheckout"
    />

    <!-- Search Modal (when toggled) -->
    <SearchModal
        v-if="showSearchModal"
        @close="toggleSearch"
        @search="handleSearch"
    />

    <!-- Notification Toast -->
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

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
import CartSidebar from './components/CartSidebar.vue'
import SearchModal from './components/SearchModal.vue'

// Router
const router = useRouter()

// State
const currentCurrency = ref('UYU')
const cartItems = ref([])
const cartCount = ref(0)
const isDark = ref(false)
const showCart = ref(false)
const showSearchModal = ref(false)

// Notification system
const notification = reactive({
  show: false,
  message: '',
  type: 'success'
})

// Methods
const handleNavigation = (path) => {
  router.push(path)
}

const handleSearch = (searchData) => {
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

const handleCategorySelect = (category) => {
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

const addToCart = (product) => {
  const existingItem = cartItems.value.find(item => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cartItems.value.push({
      ...product,
      quantity: 1,
      // Asegurar que tenga imagen por defecto
      image: product.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop'
    })
  }

  updateCartCount()
  showNotification(`${product.name} agregado al carrito`)

  // Guardar en localStorage
  localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
}

const removeFromCart = (productId) => {
  cartItems.value = cartItems.value.filter(item => item.id !== productId)
  updateCartCount()
  showNotification('Producto eliminado del carrito')

  // Guardar en localStorage
  localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
}

const updateCartQuantity = (productId, quantity) => {
  const item = cartItems.value.find(item => item.id === productId)
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = quantity
      updateCartCount()

      // Guardar en localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
    }
  }
}

const updateCartCount = () => {
  cartCount.value = cartItems.value.reduce((total, item) => total + item.quantity, 0)
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

const setCurrency = (currency) => {
  currentCurrency.value = currency
  localStorage.setItem('currency', currency)
  showNotification(`Moneda cambiada a ${currency}`)
}

const handleCheckout = () => {
  if (cartItems.value.length === 0) {
    showNotification('El carrito está vacío', 'error')
    return
  }

  const phone = '598XXXXXXXX' // Reemplaza con tu número real
  const items = cartItems.value.map(item =>
      `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}`
  ).join('\n')

  const total = cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const message = `¡Hola! Me interesa realizar este pedido:

${items}

*Total: ${currentCurrency.value} ${total.toLocaleString()}*

¿Podrían confirmarme disponibilidad y forma de pago?

¡Gracias!`

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')

  showNotification('Redirigiendo a WhatsApp...')
}

const showNotification = (message, type = 'success') => {
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

// Initialize cart from localStorage
const initCart = () => {
  const savedCart = localStorage.getItem('cartItems')
  if (savedCart) {
    try {
      cartItems.value = JSON.parse(savedCart)
      updateCartCount()
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      cartItems.value = []
    }
  }
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
  initCart()
  initCurrency()
})
</script>

<style scoped>
/* Smooth transitions for theme changes */
* {
  transition-property: background-color, border-color, color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Custom scrollbar */
:deep(::-webkit-scrollbar) {
  width: 6px;
}

:deep(::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(::-webkit-scrollbar-thumb) {
  background: #cbd5e1;
  border-radius: 3px;
}

:deep(::-webkit-scrollbar-thumb:hover) {
  background: #94a3b8;
}

/* Dark mode scrollbar */
.dark :deep(::-webkit-scrollbar-thumb) {
  background: #475569;
}

.dark :deep(::-webkit-scrollbar-thumb:hover) {
  background: #64748b;
}
</style>