<template>
  <AdminTable
      title="Tags"
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
  { key: 'name', label: 'Nombre', required: true, placeholder: 'Ej: Rústico' },
  { key: 'slug', label: 'Slug', required: true, placeholder: 'Ej: rustico', hint: 'URL amigable (solo letras minúsculas y guiones)' }
]

const loadData = () => adminStore.getTags()
const createItem = (data: any) => adminStore.createTag(data)
const updateItem = (id: string, data: any) => adminStore.updateTag(id, data)
const deleteItem = (id: string) => adminStore.deleteTag(id)
</script>