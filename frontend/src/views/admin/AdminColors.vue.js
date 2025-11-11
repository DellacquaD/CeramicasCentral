/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import AdminTable from './AdminTable.vue';
import { useAdminStore } from '@/stores/admin';
const adminStore = useAdminStore();
const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'slug', label: 'Slug' },
    {
        key: 'hex_code',
        label: 'Color',
        component: 'div',
        props: (item) => ({
            style: {
                backgroundColor: item.hex_code || '#cccccc',
                width: '30px',
                height: '30px',
                borderRadius: '4px',
                border: '1px solid #e5e7eb'
            }
        })
    }
];
const fields = [
    { key: 'name', label: 'Nombre', required: true, placeholder: 'Ej: Beige' },
    { key: 'slug', label: 'Slug', required: true, placeholder: 'Ej: beige', hint: 'URL amigable (solo letras minúsculas y guiones)' },
    { key: 'hex_code', label: 'Código HEX', type: 'color', required: false, placeholder: '#f5f5dc' }
];
const loadData = () => adminStore.getColors();
const createItem = (data) => adminStore.createColor(data);
const updateItem = (id, data) => adminStore.updateColor(id, data);
const deleteItem = (id) => adminStore.deleteColor(id);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {[typeof AdminTable, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AdminTable, new AdminTable({
    title: "Colores",
    columns: (__VLS_ctx.columns),
    fields: (__VLS_ctx.fields),
    loadData: (__VLS_ctx.loadData),
    createItem: (__VLS_ctx.createItem),
    updateItem: (__VLS_ctx.updateItem),
    deleteItem: (__VLS_ctx.deleteItem),
}));
const __VLS_1 = __VLS_0({
    title: "Colores",
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
