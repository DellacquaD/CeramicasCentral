<template>
  <AdminTable
      title="Materiales"
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
  { key: 'slug', label: 'Slug' }
]

const fields = [
  { key: 'name', label: 'Nombre', required: true, placeholder: 'Ej: Porcelanato' },
  { key: 'slug', label: 'Slug', required: true, placeholder: 'Ej: porcelanato', hint: 'URL amigable (solo letras minúsculas y guiones)' }
]

const loadData = () => adminStore.getMaterials()
const createItem = (data: any) => adminStore.createMaterial(data)
const updateItem = (id: string, data: any) => adminStore.updateMaterial(id, data)
const deleteItem = (id: string) => adminStore.deleteMaterial(id)
</script>