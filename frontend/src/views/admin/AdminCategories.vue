<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Categorías y Subcategorías</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Gestiona la estructura jerárquica del catálogo
        </p>
      </div>
      <div class="flex gap-2">
        <button
            @click="openCreateCategoryModal"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nueva Categoría</span>
        </button>
        <button
            @click="openCreateSubcategoryModal()"
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nueva Subcategoría</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Categories List -->
    <div v-else class="space-y-4">
      <div
          v-for="category in categories"
          :key="category.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
      >
        <!-- Category Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ category.name }}
                </h3>
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  category.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                ]">
                  {{ category.is_active ? 'Activa' : 'Inactiva' }}
                </span>
                <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-xs font-medium">
                  {{ category.subcategories?.length || 0 }} subcategorías
                </span>
              </div>
              <div v-if="category.image_url" class="mt-3">
                <img :src="category.image_url" :alt="category.name" class="h-20 w-20 object-cover rounded-lg">
              </div>
            </div>
            <div class="flex gap-2">
              <button
                  @click="toggleCategoryStatus(category)"
                  :class="[
                    'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                    category.is_active
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                  ]"
              >
                {{ category.is_active ? 'Desactivar' : 'Activar' }}
              </button>
              <button
                  @click="openEditCategoryModal(category)"
                  class="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Editar
              </button>
              <button
                  @click="confirmDeleteCategory(category)"
                  class="px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg text-sm font-medium transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Subcategories -->
        <div v-if="category.subcategories && category.subcategories.length > 0" class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Subcategorías</h4>
            <button
                @click="openCreateSubcategoryModal(category.id)"
                class="px-3 py-1 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Agregar subcategoría
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
                v-for="subcategory in category.subcategories"
                :key="subcategory.id"
                class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h5 class="font-medium text-gray-900 dark:text-white">
                      {{ subcategory.name }}
                    </h5>
                    <span :class="[
                      'px-1.5 py-0.5 rounded text-xs font-medium',
                      subcategory.is_active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    ]">
                      {{ subcategory.is_active ? '✓' : '✗' }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="subcategory.image_url" class="mb-3">
                <img :src="subcategory.image_url" :alt="subcategory.name" class="h-16 w-16 object-cover rounded">
              </div>
              <div class="flex gap-2">
                <button
                    @click="toggleSubcategoryStatus(subcategory)"
                    :class="[
                      'flex-1 px-2 py-1 rounded text-xs font-medium transition-colors',
                      subcategory.is_active
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                    ]"
                >
                  {{ subcategory.is_active ? 'Desactivar' : 'Activar' }}
                </button>
                <button
                    @click="openEditSubcategoryModal(subcategory)"
                    class="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 rounded text-xs font-medium transition-colors"
                >
                  Editar
                </button>
                <button
                    @click="confirmDeleteSubcategory(subcategory)"
                    class="px-2 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-800 dark:text-red-400 rounded text-xs font-medium transition-colors"
                >
                  ✗
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="p-6 text-center">
          <p class="text-gray-500 dark:text-gray-400 mb-3">No hay subcategorías aún</p>
          <button
              @click="openCreateSubcategoryModal(category.id)"
              class="px-4 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-lg text-sm font-medium transition-colors"
          >
            + Agregar primera subcategoría
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="categories.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay categorías</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Comienza creando una nueva categoría</p>
        <div class="mt-6">
          <button
              @click="openCreateCategoryModal"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            + Nueva Categoría
          </button>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}
            </h2>
            <button @click="closeCategoryModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre *
              </label>
              <input
                  v-model="categoryForm.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Cerámicas"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug (URL amigable)
              </label>
              <input
                  :value="generateSlug(categoryForm.name)"
                  type="text"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400 cursor-not-allowed"
                  placeholder="Se genera automáticamente"
              >
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Se genera automáticamente desde el nombre
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL de Imagen
              </label>
              <input
                  v-model="categoryForm.image_url"
                  type="url"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://ejemplo.com/imagen.jpg"
              >
              <div v-if="categoryForm.image_url" class="mt-2">
                <img :src="categoryForm.image_url" alt="Preview" class="h-32 w-32 object-cover rounded-lg">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Orden de visualización
              </label>
              <input
                  v-model.number="categoryForm.display_order"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
            </div>

            <div class="flex items-center">
              <input
                  v-model="categoryForm.is_active"
                  type="checkbox"
                  id="category-active"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              >
              <label for="category-active" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Categoría activa
              </label>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                  type="button"
                  @click="closeCategoryModal"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                  type="submit"
                  :disabled="saving"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {{ saving ? 'Guardando...' : (editingCategory ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Subcategory Modal -->
    <div v-if="showSubcategoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ editingSubcategory ? 'Editar Subcategoría' : 'Nueva Subcategoría' }}
            </h2>
            <button @click="closeSubcategoryModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveSubcategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría padre *
              </label>
              <select
                  v-model="subcategoryForm.category_id"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Seleccionar categoría</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre *
              </label>
              <input
                  v-model="subcategoryForm.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Porcelanatos"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug (URL amigable)
              </label>
              <input
                  :value="generateSlug(subcategoryForm.name)"
                  type="text"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400 cursor-not-allowed"
                  placeholder="Se genera automáticamente"
              >
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Se genera automáticamente desde el nombre
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL de Imagen
              </label>
              <input
                  v-model="subcategoryForm.image_url"
                  type="url"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://ejemplo.com/imagen.jpg"
              >
              <div v-if="subcategoryForm.image_url" class="mt-2">
                <img :src="subcategoryForm.image_url" alt="Preview" class="h-32 w-32 object-cover rounded-lg">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Orden de visualización
              </label>
              <input
                  v-model.number="subcategoryForm.display_order"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
            </div>

            <div class="flex items-center">
              <input
                  v-model="subcategoryForm.is_active"
                  type="checkbox"
                  id="subcategory-active"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              >
              <label for="subcategory-active" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Subcategoría activa
              </label>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                  type="button"
                  @click="closeSubcategoryModal"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                  type="submit"
                  :disabled="saving"
                  class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {{ saving ? 'Guardando...' : (editingSubcategory ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
          <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
          {{ deleteModalTitle }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          {{ deleteModalMessage }}
        </p>
        <div class="flex gap-3">
          <button
              @click="showDeleteModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
              @click="executeDelete"
              class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  display_order: number
  is_active: boolean
  subcategories?: Subcategory[]
}

interface Subcategory {
  id: string
  category_id: string
  name: string
  slug: string
  image_url: string | null
  display_order: number
  is_active: boolean
}

const loading = ref(false)
const saving = ref(false)
const categories = ref<Category[]>([])

// Función para generar slug desde un texto
const generateSlug = (text: string): string => {
  return text
      .toString()
      .normalize('NFD')                   // Normalizar caracteres Unicode
      .replace(/[\u0300-\u036f]/g, '')   // Eliminar diacríticos (acentos)
      .toLowerCase()                      // Convertir a minúsculas
      .trim()                             // Eliminar espacios al inicio/fin
      .replace(/\s+/g, '-')              // Reemplazar espacios por guiones
      .replace(/[^\w\-]+/g, '')          // Eliminar caracteres no alfanuméricos
      .replace(/\-\-+/g, '-')            // Reemplazar múltiples guiones por uno solo
      .replace(/^-+/, '')                // Eliminar guiones al inicio
      .replace(/-+$/, '')                // Eliminar guiones al final
}

// Category Modal
const showCategoryModal = ref(false)
const editingCategory = ref<Category | null>(null)
const categoryForm = ref({
  name: '',
  image_url: '',
  display_order: 0,
  is_active: true
})

// Subcategory Modal
const showSubcategoryModal = ref(false)
const editingSubcategory = ref<Subcategory | null>(null)
const subcategoryForm = ref({
  category_id: '',
  name: '',
  image_url: '',
  display_order: 0,
  is_active: true
})

// Delete Modal
const showDeleteModal = ref(false)
const deleteModalTitle = ref('')
const deleteModalMessage = ref('')
const deleteAction = ref<(() => Promise<void>) | null>(null)

// Load Categories
const loadCategories = async () => {
  loading.value = true
  try {
    const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })

    if (categoriesError) throw categoriesError

    const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('*')
        .order('display_order', { ascending: true })

    if (subcategoriesError) throw subcategoriesError

    categories.value = categoriesData.map(cat => ({
      ...cat,
      subcategories: subcategoriesData.filter(sub => sub.category_id === cat.id)
    }))
  } catch (error) {
    console.error('Error loading categories:', error)
    alert('Error al cargar las categorías')
  } finally {
    loading.value = false
  }
}

// Category CRUD
const openCreateCategoryModal = () => {
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    image_url: '',
    display_order: 0,
    is_active: true
  }
  showCategoryModal.value = true
}

const openEditCategoryModal = (category: Category) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    image_url: category.image_url || '',
    display_order: category.display_order,
    is_active: category.is_active
  }
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  editingCategory.value = null
}

const saveCategory = async () => {
  saving.value = true
  try {
    // Generar slug automáticamente desde el nombre
    const dataToSave = {
      ...categoryForm.value,
      slug: generateSlug(categoryForm.value.name)
    }

    if (editingCategory.value) {
      const { error } = await supabase
          .from('categories')
          .update(dataToSave)
          .eq('id', editingCategory.value.id)

      if (error) throw error
    } else {
      const { error } = await supabase
          .from('categories')
          .insert([dataToSave])

      if (error) throw error
    }

    await loadCategories()
    closeCategoryModal()
  } catch (error) {
    console.error('Error saving category:', error)
    alert('Error al guardar la categoría')
  } finally {
    saving.value = false
  }
}

const toggleCategoryStatus = async (category: Category) => {
  const newStatus = !category.is_active

  try {
    const { error } = await supabase
        .from('categories')
        .update({ is_active: newStatus })
        .eq('id', category.id)

    if (error) throw error

    // Actualizar inmediatamente en la UI
    const index = categories.value.findIndex(c => c.id === category.id)
    if (index !== -1) {
      categories.value[index].is_active = newStatus
    }
  } catch (error) {
    console.error('Error toggling category status:', error)
    alert('Error al cambiar el estado de la categoría')
    // Revertir el cambio en la UI si hay error
    await loadCategories()
  }
}

const confirmDeleteCategory = (category: Category) => {
  deleteModalTitle.value = '¿Eliminar categoría?'
  deleteModalMessage.value = `Se eliminará "${category.name}" y todas sus subcategorías (${category.subcategories?.length || 0}). Esta acción no se puede deshacer.`
  deleteAction.value = async () => {
    try {
      const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', category.id)

      if (error) throw error
      await loadCategories()
      showDeleteModal.value = false
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error al eliminar la categoría')
    }
  }
  showDeleteModal.value = true
}

// Subcategory CRUD
const openCreateSubcategoryModal = (categoryId?: string) => {
  editingSubcategory.value = null
  subcategoryForm.value = {
    category_id: categoryId || '',
    name: '',
    image_url: '',
    display_order: 0,
    is_active: true
  }
  showSubcategoryModal.value = true
}

const openEditSubcategoryModal = (subcategory: Subcategory) => {
  editingSubcategory.value = subcategory
  subcategoryForm.value = {
    category_id: subcategory.category_id,
    name: subcategory.name,
    image_url: subcategory.image_url || '',
    display_order: subcategory.display_order,
    is_active: subcategory.is_active
  }
  showSubcategoryModal.value = true
}

const closeSubcategoryModal = () => {
  showSubcategoryModal.value = false
  editingSubcategory.value = null
}

const saveSubcategory = async () => {
  saving.value = true
  try {
    // Generar slug automáticamente desde el nombre
    const dataToSave = {
      ...subcategoryForm.value,
      slug: generateSlug(subcategoryForm.value.name)
    }

    if (editingSubcategory.value) {
      const { error } = await supabase
          .from('subcategories')
          .update(dataToSave)
          .eq('id', editingSubcategory.value.id)

      if (error) throw error
    } else {
      const { error } = await supabase
          .from('subcategories')
          .insert([dataToSave])

      if (error) throw error
    }

    await loadCategories()
    closeSubcategoryModal()
  } catch (error) {
    console.error('Error saving subcategory:', error)
    alert('Error al guardar la subcategoría')
  } finally {
    saving.value = false
  }
}

const toggleSubcategoryStatus = async (subcategory: Subcategory) => {
  const newStatus = !subcategory.is_active

  try {
    const { error } = await supabase
        .from('subcategories')
        .update({ is_active: newStatus })
        .eq('id', subcategory.id)

    if (error) throw error

    // Actualizar inmediatamente en la UI
    for (const category of categories.value) {
      if (category.subcategories) {
        const subIndex = category.subcategories.findIndex(s => s.id === subcategory.id)
        if (subIndex !== -1) {
          category.subcategories[subIndex].is_active = newStatus
          break
        }
      }
    }
  } catch (error) {
    console.error('Error toggling subcategory status:', error)
    alert('Error al cambiar el estado de la subcategoría')
    // Revertir el cambio en la UI si hay error
    await loadCategories()
  }
}

const confirmDeleteSubcategory = (subcategory: Subcategory) => {
  deleteModalTitle.value = '¿Eliminar subcategoría?'
  deleteModalMessage.value = `Se eliminará "${subcategory.name}". Esta acción no se puede deshacer.`
  deleteAction.value = async () => {
    try {
      const { error } = await supabase
          .from('subcategories')
          .delete()
          .eq('id', subcategory.id)

      if (error) throw error
      await loadCategories()
      showDeleteModal.value = false
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      alert('Error al eliminar la subcategoría')
    }
  }
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (deleteAction.value) {
    await deleteAction.value()
  }
}

onMounted(() => {
  loadCategories()
})
</script>