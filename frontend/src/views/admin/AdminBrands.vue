<template>
  <AdminTable
      title="Marcas"
      :columns="columns"
      :fields="fields"
      :loadData="loadData"
      :createItem="createItem"
      :updateItem="updateItem"
      :deleteItem="deleteItem"
  />
</template>

<script setup lang="ts">
import AdminTable from './AdminTable.vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'slug', label: 'Slug' },
  {
    key: 'is_active',
    label: 'Activa',
    format: (value: boolean) => value ? 'Sí' : 'No'
  }
]

const fields = [
  { key: 'name', label: 'Nombre', required: true, placeholder: 'Ej: Cordillera' },
  { key: 'slug', label: 'Slug', required: true, placeholder: 'Ej: cordillera', hint: 'URL amigable (solo letras minúsculas y guiones)' },
  { key: 'description', label: 'Descripción', type: 'text', required: false },
  { key: 'logo_url', label: 'URL del Logo', type: 'url', required: false },
  { key: 'is_active', label: 'Activa', type: 'checkbox', placeholder: 'Marca activa y visible' }
]

const loadData = () => adminStore.getBrands()
const createItem = (data: any) => adminStore.createBrand(data)
const updateItem = (id: string, data: any) => adminStore.updateBrand(id, data)
const deleteItem = (id: string) => adminStore.deleteBrand(id)
</script>