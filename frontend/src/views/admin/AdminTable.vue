<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ title }}</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Gestiona {{ title.toLowerCase() }} del catálogo
        </p>
      </div>
      <button
          @click="openCreateModal"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Nuevo</span>
      </button>
    </div>

    <!-- Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-12 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>

      <div v-else-if="filteredItems.length === 0" class="p-12 text-center text-gray-500 dark:text-gray-400">
        No se encontraron resultados
      </div>

      <table v-else class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
          >
            {{ column.label }}
          </th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr
            v-for="item in filteredItems"
            :key="item.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap"
          >
            <component
                :is="column.component || 'span'"
                v-bind="column.props ? column.props(item) : {}"
                class="text-sm text-gray-900 dark:text-white"
            >
              {{ formatValue(item, column) }}
            </component>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
                @click="openEditModal(item)"
                class="text-blue-600 dark:text-blue-400 hover:underline mr-4"
            >
              Editar
            </button>
            <button
                @click="confirmDelete(item)"
                class="text-red-600 dark:text-red-400 hover:underline"
            >
              Eliminar
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ editingItem ? 'Editar' : 'Crear' }} {{ title.slice(0, -1) }}
          </h3>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <div v-for="field in fields" :key="field.key" class="space-y-2">
            <label :for="field.key" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ field.label }}
            </label>

            <input
                v-if="field.type !== 'checkbox' && field.type !== 'color'"
                v-model="formData[field.key]"
                :type="field.type || 'text'"
                :id="field.key"
                :required="field.required !== false"
                :placeholder="field.placeholder"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />

            <div v-else-if="field.type === 'color'" class="flex items-center space-x-4">
              <input
                  v-model="formData[field.key]"
                  type="color"
                  :id="field.key"
                  class="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              />
              <input
                  v-model="formData[field.key]"
                  type="text"
                  placeholder="#000000"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <label v-else-if="field.type === 'checkbox'" class="flex items-center space-x-2">
              <input
                  v-model="formData[field.key]"
                  type="checkbox"
                  :id="field.key"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ field.placeholder }}</span>
            </label>

            <p v-if="field.hint" class="text-xs text-gray-500 dark:text-gray-400">
              {{ field.hint }}
            </p>
          </div>

          <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-4">
            <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
            >
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
          <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
          ¿Eliminar este elemento?
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-center mb-6">
          Esta acción no se puede deshacer.
        </p>
        <div class="flex items-center justify-center space-x-3">
          <button
              @click="showDeleteConfirm = false"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
              @click="handleDelete"
              :disabled="deleting"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition-colors"
          >
            {{ deleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Column {
  key: string
  label: string
  component?: string
  props?: (item: any) => any
  format?: (value: any) => string
}

interface Field {
  key: string
  label: string
  type?: string
  required?: boolean
  placeholder?: string
  hint?: string
}

interface Props {
  title: string
  columns: Column[]
  fields: Field[]
  loadData: () => Promise<any[]>
  createItem: (data: any) => Promise<any>
  updateItem: (id: string, data: any) => Promise<any>
  deleteItem: (id: string) => Promise<void>
}

const props = defineProps<Props>()

const items = ref<any[]>([])
const loading = ref(true)
const searchTerm = ref('')
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const editingItem = ref<any>(null)
const itemToDelete = ref<any>(null)
const formData = ref<any>({})
const saving = ref(false)
const deleting = ref(false)
const error = ref<string | null>(null)

const filteredItems = computed(() => {
  if (!searchTerm.value) return items.value

  const term = searchTerm.value.toLowerCase()
  return items.value.filter(item => {
    return Object.values(item).some(value =>
        String(value).toLowerCase().includes(term)
    )
  })
})

const formatValue = (item: any, column: Column) => {
  const value = item[column.key]
  if (column.format) {
    return column.format(value)
  }
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No'
  }
  return value || '-'
}

const loadItems = async () => {
  loading.value = true
  try {
    items.value = await props.loadData()
  } catch (err) {
    console.error('Error loading items:', err)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingItem.value = null
  formData.value = {}
  error.value = null
  showModal.value = true
}

const openEditModal = (item: any) => {
  editingItem.value = item
  formData.value = { ...item }
  error.value = null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingItem.value = null
  formData.value = {}
  error.value = null
}

const handleSubmit = async () => {
  saving.value = true
  error.value = null

  try {
    if (editingItem.value) {
      await props.updateItem(editingItem.value.id, formData.value)
    } else {
      await props.createItem(formData.value)
    }
    await loadItems()
    closeModal()
  } catch (err: any) {
    error.value = err.message || 'Error al guardar'
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item: any) => {
  itemToDelete.value = item
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!itemToDelete.value) return

  deleting.value = true
  try {
    await props.deleteItem(itemToDelete.value.id)
    await loadItems()
    showDeleteConfirm.value = false
    itemToDelete.value = null
  } catch (err: any) {
    alert('Error al eliminar: ' + (err.message || 'Error desconocido'))
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadItems()
})
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>