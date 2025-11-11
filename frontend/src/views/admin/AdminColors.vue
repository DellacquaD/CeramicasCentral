<template>
  <AdminTable
      title="Colores"
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
    key: 'hex_code',
    label: 'Color',
    component: 'div',
    props: (item: any) => ({
      style: {
        backgroundColor: item.hex_code || '#cccccc',
        width: '30px',
        height: '30px',
        borderRadius: '4px',
        border: '1px solid #e5e7eb'
      }
    })
  }
]

const fields = [
  { key: 'name', label: 'Nombre', required: true, placeholder: 'Ej: Beige' },
  { key: 'slug', label: 'Slug', required: true, placeholder: 'Ej: beige', hint: 'URL amigable (solo letras minúsculas y guiones)' },
  { key: 'hex_code', label: 'Código HEX', type: 'color', required: false, placeholder: '#f5f5dc' }
]

const loadData = () => adminStore.getColors()
const createItem = (data: any) => adminStore.createColor(data)
const updateItem = (id: string, data: any) => adminStore.updateColor(id, data)
const deleteItem = (id: string) => adminStore.deleteColor(id)
</script>