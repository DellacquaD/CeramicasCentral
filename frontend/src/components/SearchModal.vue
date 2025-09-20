<template>
  <!-- Search Modal Overlay -->
  <div class="fixed inset-0 z-50 flex items-start justify-center pt-20">
    <!-- Background overlay -->
    <div
        @click="$emit('close')"
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
    ></div>

    <!-- Search modal -->
    <div class="relative w-full max-w-4xl mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300">
      <!-- Search input -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              @input="handleInput"
              type="text"
              placeholder="Buscar productos, categorías, marcas..."
              class="w-full pl-12 pr-12 py-4 text-lg bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white placeholder-gray-500"
              autofocus
          />
          <button
              @click="$emit('close')"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
          >
            <XMarkIcon class="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </div>

      <!-- Search suggestions/results -->
      <div class="max-h-96 overflow-y-auto">
        <!-- Quick categories -->
        <div v-if="!searchQuery" class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categorías populares</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
                v-for="category in popularCategories"
                :key="category.name"
                @click="selectCategory(category)"
                class="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors text-left"
            >
              <div :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center',
                category.color
              ]">
                <component :is="category.icon" class="w-6 h-6 text-white" />
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">{{ category.name }}</div>
                <div class="text-sm text-gray-500">{{ category.count }} productos</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Search suggestions -->
        <div v-else-if="searchSuggestions.length > 0" class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sugerencias</h3>
          <div class="space-y-2">
            <button
                v-for="suggestion in searchSuggestions"
                :key="suggestion"
                @click="selectSuggestion(suggestion)"
                class="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors text-left"
            >
              <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span class="text-gray-900 dark:text-white">{{ suggestion }}</span>
              <ArrowUpIcon class="w-4 h-4 text-gray-400 transform -rotate-45 flex-shrink-0" />
            </button>
          </div>
        </div>

        <!-- Recent searches -->
        <div v-if="recentSearches.length > 0" class="border-t border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Búsquedas recientes</h3>
            <button
                @click="clearRecentSearches"
                class="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Limpiar
            </button>
          </div>
          <div class="space-y-2">
            <button
                v-for="recent in recentSearches"
                :key="recent"
                @click="selectSuggestion(recent)"
                class="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors text-left"
            >
              <ClockIcon class="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span class="text-gray-900 dark:text-white">{{ recent }}</span>
            </button>
          </div>
        </div>

        <!-- Popular searches -->
        <div class="border-t border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Búsquedas populares</h3>
          <div class="flex flex-wrap gap-2">
            <button
                v-for="popular in popularSearches"
                :key="popular"
                @click="selectSuggestion(popular)"
                class="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              {{ popular }}
            </button>
          </div>
        </div>
      </div>

      <!-- Footer with shortcuts -->
      <div class="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
        <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center space-x-4">
            <span class="flex items-center space-x-1">
              <kbd class="px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-xs">Enter</kbd>
              <span>para buscar</span>
            </span>
            <span class="flex items-center space-x-1">
              <kbd class="px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-xs">Esc</kbd>
              <span>para cerrar</span>
            </span>
          </div>
          <div class="flex items-center space-x-1">
            <span>Búsqueda avanzada disponible</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ClockIcon,
  ArrowUpIcon
} from '@heroicons/vue/24/outline'

// Emits
const emit = defineEmits(['close', 'search'])

// Local state
const searchQuery = ref('')
const recentSearches = ref([])

// Popular categories data
const popularCategories = ref([
  {
    name: 'Cerámicas',
    count: 245,
    icon: 'div', // Placeholder for ceramic icon
    color: 'bg-blue-500'
  },
  {
    name: 'Griferías',
    count: 156,
    icon: 'div', // Placeholder for faucet icon
    color: 'bg-green-500'
  },
  {
    name: 'Porcelanatos',
    count: 189,
    icon: 'div', // Placeholder for tile icon
    color: 'bg-purple-500'
  },
  {
    name: 'Loza Sanitaria',
    count: 98,
    icon: 'div', // Placeholder for bathroom icon
    color: 'bg-red-500'
  },
  {
    name: 'Revestimientos',
    count: 134,
    icon: 'div', // Placeholder for wall icon
    color: 'bg-yellow-500'
  },
  {
    name: 'Cocinas',
    count: 87,
    icon: 'div', // Placeholder for kitchen icon
    color: 'bg-indigo-500'
  }
])

const popularSearches = ref([
  'Cerámica 30x30',
  'Grifo cocina',
  'Porcelanato 60x60',
  'Inodoro con descarga dual',
  'Azulejo subway',
  'Mesada granito',
  'Ducha eléctrica',
  'Baldosa antideslizante'
])

// Computed
const searchSuggestions = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return []

  const query = searchQuery.value.toLowerCase()
  const suggestions = [
    'Cerámicas para baño',
    'Cerámica pared cocina',
    'Cerámica piso exterior',
    'Grifo lavatorio',
    'Grifo ducha',
    'Grifo cocina extraible',
    'Porcelanato imitación madera',
    'Porcelanato pulido',
    'Porcelanato rectificado',
    'Revestimiento piedra',
    'Revestimiento ladrillo',
    'Loza sanitaria moderna',
    'Inodoro suspendido',
    'Bidet suspendido'
  ].filter(item =>
      item.toLowerCase().includes(query)
  ).slice(0, 6)

  return suggestions
})

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    addToRecentSearches(searchQuery.value.trim())
    emit('search', {
      query: searchQuery.value.trim(),
      category: ''
    })
    emit('close')
  }
}

const handleInput = () => {
  // Aquí podrías hacer búsqueda en tiempo real
}

const selectCategory = (category) => {
  emit('search', {
    query: '',
    category: category.name.toLowerCase()
  })
  emit('close')
}

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion
  handleSearch()
}

const addToRecentSearches = (query) => {
  recentSearches.value = [
    query,
    ...recentSearches.value.filter(item => item !== query)
  ].slice(0, 5)

  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

const clearRecentSearches = () => {
  recentSearches.value = []
  localStorage.removeItem('recentSearches')
}

const handleEscape = (event) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// Lifecycle
onMounted(() => {
  const saved = localStorage.getItem('recentSearches')
  if (saved) {
    recentSearches.value = JSON.parse(saved)
  }
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>