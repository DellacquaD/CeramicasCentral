/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { ref } from 'vue';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import ProductCard from './ProductCard.vue';
// Props
const __VLS_props = defineProps({
    currency: {
        type: String,
        default: 'UYU'
    }
});
// Emits
const emit = defineEmits(['categorySelect', 'viewAll']);
// Categories data (desktop-first, más información)
const categories = ref([
    {
        id: 1,
        name: 'Cerámicas',
        description: 'Revestimientos cerámicos de alta calidad para cocina, baño y espacios exteriores',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        productCount: 245,
        tag: 'Más Popular',
        featured: true,
        size: 'large',
        features: ['Antideslizante', 'Resistente al agua', 'Fácil limpieza'],
        priceRange: { min: 890, max: 4500 }
    },
    {
        id: 2,
        name: 'Griferías para Baño',
        description: 'Grifos modernos, mezcladores y accesorios para baño con diseño contemporáneo',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
        productCount: 156,
        tag: 'Premium',
        features: ['Ahorro de agua', 'Garantía 5 años', 'Instalación fácil'],
        priceRange: { min: 2500, max: 15000 }
    },
    {
        id: 3,
        name: 'Porcelanatos',
        description: 'Pisos de porcelanato de alta resistencia con acabados premium',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        productCount: 189,
        tag: 'Resistente',
        features: ['Alta durabilidad', 'Variedad de diseños', 'Bajo mantenimiento'],
        priceRange: { min: 1200, max: 8500 }
    },
    {
        id: 4,
        name: 'Revestimientos',
        description: 'Revestimientos decorativos para interiores y exteriores',
        image: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&h=600&fit=crop',
        productCount: 134,
        tag: 'Decorativo',
        features: ['Diseños únicos', 'Fácil aplicación', 'Resistente a UV'],
        priceRange: { min: 650, max: 3500 }
    },
    {
        id: 5,
        name: 'Loza Sanitaria',
        description: 'Inodoros, lavabos, bidets y accesorios sanitarios de primera calidad',
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
        productCount: 98,
        tag: 'Sanitario',
        size: 'large',
        features: ['Descarga dual', 'Diseño ergonómico', 'Fácil instalación'],
        priceRange: { min: 3500, max: 25000 }
    },
    {
        id: 6,
        name: 'Cocinas',
        description: 'Muebles de cocina, mesadas y accesorios para espacios funcionales',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        productCount: 87,
        tag: 'Funcional',
        features: ['Medidas personalizadas', 'Materiales premium', 'Garantía extendida'],
        priceRange: { min: 15000, max: 150000 }
    }
]);
// Statistics
const statistics = ref([
    { value: '1000+', label: 'Productos' },
    { value: '50+', label: 'Marcas' },
    { value: '15+', label: 'Años en el rubro' },
    { value: '5000+', label: 'Clientes satisfechos' }
]);
// Methods
const handleCategorySelect = (category) => {
    emit('categorySelect', category);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['category-card']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)({
    ...{ class: "max-w-screen-2xl mx-auto py-16" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "text-center mb-16" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
    ...{ class: "text-4xl font-bold text-gray-900 dark:text-white mb-4" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "text-blue-600" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8" },
});
for (const [category] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    // @ts-ignore
    [categories,];
    /** @type {[typeof ProductCard, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(ProductCard, new ProductCard({
        ...{ 'onSelect': {} },
        key: (category.id),
        category: (category),
        currency: (__VLS_ctx.currency),
        ...{ class: "category-card" },
        ...{ class: ([
                category.featured ? 'xl:col-span-2' : '',
                category.size === 'large' ? 'lg:col-span-2' : ''
            ]) },
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onSelect': {} },
        key: (category.id),
        category: (category),
        currency: (__VLS_ctx.currency),
        ...{ class: "category-card" },
        ...{ class: ([
                category.featured ? 'xl:col-span-2' : '',
                category.size === 'large' ? 'lg:col-span-2' : ''
            ]) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    const __VLS_5 = ({ select: {} },
        { onSelect: (__VLS_ctx.handleCategorySelect) });
    // @ts-ignore
    [currency, handleCategorySelect,];
    var __VLS_2;
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "text-center mt-16" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('viewAll');
            // @ts-ignore
            [$emit,];
        } },
    ...{ class: "inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "text-lg" },
});
const __VLS_7 = {}.ArrowRightIcon;
/** @type {[typeof __VLS_components.ArrowRightIcon, ]} */ ;
// @ts-ignore
ArrowRightIcon;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
    ...{ class: "w-6 h-6" },
}));
const __VLS_9 = __VLS_8({
    ...{ class: "w-6 h-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "mt-20 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-12" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "grid grid-cols-2 lg:grid-cols-4 gap-8" },
});
for (const [stat] of __VLS_getVForSourceType((__VLS_ctx.statistics))) {
    // @ts-ignore
    [statistics,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        key: (stat.label),
        ...{ class: "text-center" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2" },
    });
    (stat.value);
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "text-gray-600 dark:text-gray-400 font-medium" },
    });
    (stat.label);
}
/** @type {__VLS_StyleScopedClasses['max-w-screen-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['category-card']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['to-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:from-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:to-purple-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-20']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['to-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:from-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:to-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-12']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        ...__VLS_props,
        ...{},
        ...{},
        ArrowRightIcon: ArrowRightIcon,
        ProductCard: ProductCard,
        categories: categories,
        statistics: statistics,
        handleCategorySelect: handleCategorySelect,
    }),
});
export default (await import('vue')).defineComponent({
    setup: () => ({
        ...__VLS_props,
        ...{},
        ...{},
    }),
});
; /* PartiallyEnd: #4569/main.vue */
