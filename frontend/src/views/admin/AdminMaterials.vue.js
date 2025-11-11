/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import AdminTable from './AdminTable.vue';
import { useAdminStore } from '@/stores/admin';
const adminStore = useAdminStore();
const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'slug', label: 'Slug' }
];
const fields = [
    { key: 'name', label: 'Nombre', required: true, placeholder: 'Ej: Porcelanato' },
    { key: 'slug', label: 'Slug', required: true, placeholder: 'Ej: porcelanato', hint: 'URL amigable (solo letras minúsculas y guiones)' }
];
const loadData = () => adminStore.getMaterials();
const createItem = (data) => adminStore.createMaterial(data);
const updateItem = (id, data) => adminStore.updateMaterial(id, data);
const deleteItem = (id) => adminStore.deleteMaterial(id);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {[typeof AdminTable, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AdminTable, new AdminTable({
    title: "Materiales",
    columns: (__VLS_ctx.columns),
    fields: (__VLS_ctx.fields),
    loadData: (__VLS_ctx.loadData),
    createItem: (__VLS_ctx.createItem),
    updateItem: (__VLS_ctx.updateItem),
    deleteItem: (__VLS_ctx.deleteItem),
}));
const __VLS_1 = __VLS_0({
    title: "Materiales",
    columns: (__VLS_ctx.columns),
    fields: (__VLS_ctx.fields),
    loadData: (__VLS_ctx.loadData),
    createItem: (__VLS_ctx.createItem),
    updateItem: (__VLS_ctx.updateItem),
    deleteItem: (__VLS_ctx.deleteItem),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
var __VLS_3 = {};
// @ts-ignore
[columns, fields, loadData, createItem, updateItem, deleteItem,];
var __VLS_2;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        AdminTable: AdminTable,
        columns: columns,
        fields: fields,
        loadData: loadData,
        createItem: createItem,
        updateItem: updateItem,
        deleteItem: deleteItem,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
