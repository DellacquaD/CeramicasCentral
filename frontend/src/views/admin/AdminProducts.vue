<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Productos</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Gestiona el catálogo de productos
        </p>
      </div>
      <button
          @click="openCreateModal"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Nuevo Producto</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input
              v-model="filters.search"
              type="text"
              placeholder="Buscar por nombre o SKU..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
        <div>
          <select
              v-model="filters.brand"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas las marcas</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">
              {{ brand.name }}
            </option>
          </select>
        </div>
        <div>
          <select
              v-model="filters.category"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas las categorías</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        <div>
          <select
              v-model="filters.status"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
            <option value="available">Disponibles</option>
            <option value="unavailable">No disponibles</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Products Table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Producto
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              SKU
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Precio
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Stock
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Estado
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div v-if="product.images && product.images[0]" class="h-10 w-10 flex-shrink-0">
                  <img :src="product.images[0].url" :alt="product.name" class="h-10 w-10 rounded object-cover">
                </div>
                <div v-else class="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ product.name }}
                  </div>
<!--                  <div class="text-sm text-gray-500 dark:text-gray-400">-->
<!--                    {{ getBrandName(product.brand_id) }}-->
<!--                  </div>-->
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">{{ product.sku }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                ${{ product.price?.toLocaleString() }}
              </div>
              <div v-if="product.compare_price" class="text-xs text-gray-500 dark:text-gray-400 line-through">
                ${{ product.compare_price?.toLocaleString() }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  product.stock > product.low_stock_threshold
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : product.stock > 0
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                ]">
                  {{ product.stock }} unidades
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex gap-1">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    product.activo
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                  ]">
                    {{ product.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                <span v-if="product.is_featured" class="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 rounded-full text-xs font-medium">
                    ⭐
                  </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button
                    @click="toggleProductStatus(product)"
                    :class="[
                        'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                        product.activo
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                      ]"
                >
                  {{ product.activo ? 'Desactivar' : 'Activar' }}
                </button>
                <button
                    @click="openEditModal(product)"
                    class="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-medium transition-colors"
                >
                  Editar
                </button>
                <button
                    @click="confirmDelete(product)"
                    class="px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg text-xs font-medium transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay productos</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ filters.search || filters.brand || filters.category || filters.status ? 'No se encontraron productos con los filtros aplicados' : 'Comienza creando un nuevo producto' }}
        </p>
      </div>
    </div>

    <!-- Product Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full my-8">
        <div class="p-6 max-h-[85vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-gray-800 pb-4 border-b dark:border-gray-700">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}
            </h2>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveProduct" class="space-y-6">
            <!-- Información básica -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del producto *
                </label>
                <input
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ej: Porcelanato Esmaltado 60x60"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SKU *
                </label>
                <input
                    v-model="form.sku"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ej: POR-60X60-001"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Slug (URL)
                </label>
                <input
                    :value="generateSlug(form.name)"
                    type="text"
                    disabled
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400 cursor-not-allowed"
                >
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Se genera automáticamente
                </p>
              </div>
            </div>

            <!-- Precios -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Precio *
                </label>
                <input
                    v-model.number="form.price"
                    type="number"
                    step="0.01"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Precio comparación
                </label>
                <input
                    v-model.number="form.compare_price"
                    type="number"
                    step="0.01"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Costo
                </label>
                <input
                    v-model.number="form.cost"
                    type="number"
                    step="0.01"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                >
              </div>
            </div>

            <!-- Stock -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stock *
                </label>
                <input
                    v-model.number="form.stock"
                    type="number"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Umbral de stock bajo
                </label>
                <input
                    v-model.number="form.low_stock_threshold"
                    type="number"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="5"
                >
              </div>
            </div>

            <!-- Marca, Color, Material -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Marca *
                </label>
                <select
                    v-model="form.brand_id"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccionar marca</option>
                  <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                    {{ brand.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <select
                    v-model="form.color_id"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Sin color</option>
                  <option v-for="color in colors" :key="color.id" :value="color.id">
                    {{ color.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Material
                </label>
                <select
                    v-model="form.material_id"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Sin material</option>
                  <option v-for="material in materials" :key="material.id" :value="material.id">
                    {{ material.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Categorías -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categorías *
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                <label v-for="cat in categories" :key="cat.id" class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                  <input
                      type="checkbox"
                      :value="cat.id"
                      v-model="form.category_ids"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  >
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ cat.name }}</span>
                </label>
              </div>
            </div>

            <!-- Subcategorías -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subcategorías
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                <label v-for="sub in subcategories" :key="sub.id" class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                  <input
                      type="checkbox"
                      :value="sub.id"
                      v-model="form.subcategory_ids"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  >
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ sub.name }}</span>
                </label>
              </div>
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                <label v-for="tag in tags" :key="tag.id" class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                  <input
                      type="checkbox"
                      :value="tag.id"
                      v-model="form.tag_ids"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  >
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ tag.name }}</span>
                </label>
              </div>
            </div>

            <!-- Imágenes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Imágenes del producto
              </label>
              <div class="space-y-2">
                <div v-for="(image, index) in form.images" :key="index" class="flex gap-2">
                  <input
                      v-model="form.images[index]"
                      type="text"
                      class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://ejemplo.com/imagen.jpg"
                  >
                  <button
                      type="button"
                      @click="removeImage(index)"
                      class="px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <button
                    type="button"
                    @click="addImage"
                    class="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                  + Agregar imagen
                </button>
              </div>
              <div v-if="form.images.some(img => img)" class="mt-4 grid grid-cols-4 gap-2">
                <div v-for="(image, index) in form.images.filter(img => img)" :key="index" class="relative">
                  <img :src="image" :alt="`Imagen ${index + 1}`" class="w-full h-24 object-cover rounded-lg">
                  <div class="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {{ index + 1 }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Peso (opcional) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Peso (kg)
              </label>
              <input
                  v-model.number="form.weight"
                  type="number"
                  step="0.01"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
              >
            </div>

            <!-- Checkboxes de estado -->
            <div class="space-y-3">
              <div class="flex items-center">
                <input
                    v-model="form.activo"
                    type="checkbox"
                    id="is-active"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                >
                <label for="is-active" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Producto activo
                </label>
              </div>

              <div class="flex items-center">
                <input
                    v-model="form.disponible"
                    type="checkbox"
                    id="is-available"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                >
                <label for="is-available" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Disponible para venta
                </label>
              </div>

              <div class="flex items-center">
                <input
                    v-model="form.is_featured"
                    type="checkbox"
                    id="is-featured"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                >
                <label for="is-featured" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Producto destacado
                </label>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
              <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                  type="submit"
                  :disabled="saving"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {{ saving ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear') }}
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
          ¿Eliminar producto?
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          Se eliminará "{{ productToDelete?.name }}". Esta acción no se puede deshacer.
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
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  sku: string
  name: string
  slug: string
  price: number
  compare_price: number | null
  cost: number | null
  stock: number
  low_stock_threshold: number
  brand_id: string
  color_id: string | null
  material_id: string | null
  activo: boolean  // en español en la BD
  disponible: boolean  // en español en la BD
  is_featured: boolean
  weight: number | null
  images?: Array<{ url: string; display_order: number }>
  categories?: Array<{ category_id: string }>
}

interface Brand {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
}

interface Subcategory {
  id: string
  name: string
  category_id: string
}

interface Color {
  id: string
  name: string
}

interface Material {
  id: string
  name: string
}

interface Tag {
  id: string
  name: string
}

const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingProduct = ref<Product | null>(null)
const productToDelete = ref<Product | null>(null)

const products = ref<Product[]>([])
const brands = ref<Brand[]>([])
const categories = ref<Category[]>([])
const subcategories = ref<Subcategory[]>([])
const colors = ref<Color[]>([])
const materials = ref<Material[]>([])
const tags = ref<Tag[]>([])

const filters = ref({
  search: '',
  brand: '',
  category: '',
  status: ''
})

const form = ref({
  name: '',
  sku: '',
  price: 0,
  compare_price: null as number | null,
  cost: null as number | null,
  stock: 0,
  low_stock_threshold: 5,
  brand_id: '',
  color_id: null as string | null,
  material_id: null as string | null,
  category_ids: [] as string[],
  subcategory_ids: [] as string[],
  tag_ids: [] as string[],
  images: [''] as string[],
  weight: null as number | null,
  activo: true,
  disponible: true,
  is_featured: false
})

// Función para generar slug
const generateSlug = (text: string): string => {
  if (!text) return ''
  return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
}

// Computed para filtrar productos
const filteredProducts = computed(() => {
  let result = products.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search)
    )
  }

  if (filters.value.category) {
    result = result.filter(p =>
        p.categories?.some(c => c.category_id === filters.value.category)
    )
  }

  if (filters.value.brand) {
    result = result.filter(p => p.brand_id === filters.value.brand)
  }

  if (filters.value.status) {
    switch (filters.value.status) {
      case 'active':
        result = result.filter(p => p.activo)
        break
      case 'inactive':
        result = result.filter(p => !p.activo)
        break
      case 'available':
        result = result.filter(p => p.disponible)
        break
      case 'unavailable':
        result = result.filter(p => !p.disponible)
        break
    }
  }

  return result
})

// Cargar datos
const loadData = async () => {
  loading.value = true
  try {
    // Cargar productos con imágenes
    const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
        *,
        images:product_images(url, display_order),
        categories:product_categories(category_id)
      `)
        .order('created_at', { ascending: false })

    if (productsError) throw productsError
    products.value = productsData.map((p: any )=> ({
      ...p,
      images: p.images.sort((a: any, b: any) => a.display_order - b.display_order)
    }))

    // Cargar catálogos
    const [brandsRes, categoriesRes, subcategoriesRes, colorsRes, materialsRes, tagsRes] = await Promise.all([
      supabase.from('brands').select('*').order('name'),
      supabase.from('categories').select('*').order('name'),
      supabase.from('subcategories').select('*').order('name'),
      supabase.from('colors').select('*').order('name'),
      supabase.from('materials').select('*').order('name'),
      supabase.from('tags').select('*').order('name')
    ])

    if (brandsRes.data) brands.value = brandsRes.data
    if (categoriesRes.data) categories.value = categoriesRes.data
    if (subcategoriesRes.data) subcategories.value = subcategoriesRes.data
    if (colorsRes.data) colors.value = colorsRes.data
    if (materialsRes.data) materials.value = materialsRes.data
    if (tagsRes.data) tags.value = tagsRes.data

  } catch (error) {
    console.error('Error loading data:', error)
    alert('Error al cargar los datos')
  } finally {
    loading.value = false
  }
}

// Abrir modal de creación
const openCreateModal = () => {
  editingProduct.value = null
  form.value = {
    name: '',
    sku: '',
    price: 0,
    compare_price: null,
    cost: null,
    stock: 0,
    low_stock_threshold: 5,
    brand_id: '',
    color_id: null,
    material_id: null,
    category_ids: [],
    subcategory_ids: [],
    tag_ids: [],
    images: [''],
    weight: null,
    activo: true,
    disponible: true,
    is_featured: false
  }
  showModal.value = true
}

// Abrir modal de edición
const openEditModal = async (product: Product) => {
  editingProduct.value = product

  // Cargar relaciones
  const [categoriesRes, subcategoriesRes, tagsRes] = await Promise.all([
    supabase.from('product_categories').select('category_id').eq('product_id', product.id),
    supabase.from('product_subcategories').select('subcategory_id').eq('product_id', product.id),
    supabase.from('product_tags').select('tag_id').eq('product_id', product.id)
  ])

  form.value = {
    name: product.name,
    sku: product.sku,
    price: product.price,
    compare_price: product.compare_price,
    cost: product.cost,
    stock: product.stock,
    low_stock_threshold: product.low_stock_threshold,
    brand_id: product.brand_id,
    color_id: product.color_id,
    material_id: product.material_id,
    category_ids: categoriesRes.data?.map((c: any) => c.category_id) || [],
    subcategory_ids: subcategoriesRes.data?.map((s: any) => s.subcategory_id) || [],
    tag_ids: tagsRes.data?.map((t: any) => t.tag_id) || [],
    images: product.images?.map(img => img.url) || [''],
    weight: product.weight,
    activo: product.activo,
    disponible: product.disponible,
    is_featured: product.is_featured
  }

  if (form.value.images.length === 0) {
    form.value.images = ['']
  }

  showModal.value = true
}

// Cerrar modal
const closeModal = () => {
  showModal.value = false
  editingProduct.value = null
}

// Agregar imagen
const addImage = () => {
  form.value.images.push('')
}

// Quitar imagen
const removeImage = (index: number) => {
  form.value.images.splice(index, 1)
  if (form.value.images.length === 0) {
    form.value.images = ['']
  }
}

// Guardar producto
const saveProduct = async () => {
  saving.value = true
  try {
    const slug = generateSlug(form.value.name)

    const productData = {
      sku: form.value.sku,
      nombre: form.value.name,
      slug: slug,
      precio: form.value.price,
      compare_price: form.value.compare_price,
      cost: form.value.cost,
      stock: form.value.stock,
      low_stock_threshold: form.value.low_stock_threshold,
      brand_id: form.value.brand_id,
      color_id: form.value.color_id || null,
      material_id: form.value.material_id || null,
      weight: form.value.weight,
      activo: form.value.activo,
      disponible: form.value.disponible,
      is_featured: form.value.is_featured
    }

    let productId: string

    if (editingProduct.value) {
      // Actualizar producto
      const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.value.id)

      if (error) throw error
      productId = editingProduct.value.id

      // Eliminar imágenes antiguas
      await supabase
          .from('product_images')
          .delete()
          .eq('product_id', productId)

      // Eliminar relaciones antiguas
      await Promise.all([
        supabase.from('product_categories').delete().eq('product_id', productId),
        supabase.from('product_subcategories').delete().eq('product_id', productId),
        supabase.from('product_tags').delete().eq('product_id', productId)
      ])

    } else {
      // Crear producto
      const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single()

      if (error) throw error
      productId = data.id
    }

    // Insertar imágenes
    const imageUrls = form.value.images.filter(img => img.trim() !== '')
    if (imageUrls.length > 0) {
      const imagesToInsert = imageUrls.map((url, index) => ({
        product_id: productId,
        url: url,
        display_order: index
      }))

      await supabase.from('product_images').insert(imagesToInsert)
    }

    // Insertar relaciones
    if (form.value.category_ids.length > 0) {
      await supabase.from('product_categories').insert(
          form.value.category_ids.map(catId => ({ product_id: productId, category_id: catId }))
      )
    }

    if (form.value.subcategory_ids.length > 0) {
      await supabase.from('product_subcategories').insert(
          form.value.subcategory_ids.map(subId => ({ product_id: productId, subcategory_id: subId }))
      )
    }

    if (form.value.tag_ids.length > 0) {
      await supabase.from('product_tags').insert(
          form.value.tag_ids.map(tagId => ({ product_id: productId, tag_id: tagId }))
      )
    }

    await loadData()
    closeModal()

  } catch (error) {
    console.error('Error saving product:', error)
    alert('Error al guardar el producto')
  } finally {
    saving.value = false
  }
}

// Toggle estado del producto
const toggleProductStatus = async (product: Product) => {
  const newStatus = !product.activo

  try {
    const { error } = await supabase
        .from('products')
        .update({ activo: newStatus })
        .eq('id', product.id)

    if (error) throw error

    // Actualización inmediata en la UI
    const index = products.value.findIndex(p => p.id === product.id)
    if (products.value[index]) {
      products.value[index].activo = newStatus
    }
  } catch (error) {
    console.error('Error toggling product status:', error)
    alert('Error al cambiar el estado del producto')
    // Revertir si hay error
    await loadData()
  }
}

// Confirmar eliminación
const confirmDelete = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

// Ejecutar eliminación
const executeDelete = async () => {
  if (!productToDelete.value) return

  try {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.value.id)

    if (error) throw error

    await loadData()
    showDeleteModal.value = false
    productToDelete.value = null

  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Error al eliminar el producto')
  }
}

onMounted(() => {
  loadData()
})
</script>
