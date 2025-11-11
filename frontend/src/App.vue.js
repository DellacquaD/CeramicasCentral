/// <reference types="../node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import CartSidebar from './components/CartSidebar.vue';
import SearchModal from './components/SearchModal.vue';
import { useCartStore } from './stores/cart';
import { useProductsStore } from './stores/products';
import { useCotizacion } from './services/cotizacionService';
// Router y Stores
const router = useRouter();
const cartStore = useCartStore();
const productsStore = useProductsStore();
// Cotización service
const { obtenerCotizacion } = useCotizacion();
// State (solo lo que no está en el store)
const currentCurrency = ref('UYU');
const isDark = ref(false);
const showCart = ref(false);
const showSearchModal = ref(false);
// Notification system (local para notificaciones de la app)
const notification = reactive({
    show: false,
    message: '',
    type: 'success'
});
// Methods
const handleNavigation = (path) => {
    router.push(path);
};
const handleSearch = (searchData) => {
    const query = typeof searchData === 'string' ? searchData : searchData.query || searchData;
    router.push({
        name: 'Search',
        query: {
            q: query,
            categoria: searchData.category || ''
        }
    });
    showSearchModal.value = false;
    showNotification(`Buscando: ${query}`);
};
const handleCategorySelect = (category) => {
    const categorySlug = category.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/ñ/g, 'n');
    router.push(`/categoria/${categorySlug}`);
    showNotification(`Explorando ${category.name}`);
};
const toggleCart = () => {
    showCart.value = !showCart.value;
};
const toggleSearch = () => {
    showSearchModal.value = !showSearchModal.value;
};
const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle('dark', isDark.value);
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    showNotification(`Cambiado a tema ${isDark.value ? 'oscuro' : 'claro'}`);
};
const setCurrency = (currency) => {
    currentCurrency.value = currency;
    localStorage.setItem('currency', currency);
    showNotification(`Moneda cambiada a ${currency}`);
};
const showNotification = (message, type = 'success') => {
    notification.message = message;
    notification.type = type;
    notification.show = true;
    setTimeout(() => {
        notification.show = false;
    }, 3000);
};
// Initialize theme
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
    document.documentElement.classList.toggle('dark', isDark.value);
};
// Initialize currency
const initCurrency = () => {
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
        currentCurrency.value = savedCurrency;
    }
};
// Initialize all on mount
onMounted(async () => {
    console.log('🚀 Inicializando aplicación...');
    // Inicializar tema y moneda
    initTheme();
    initCurrency();
    // Cargar carrito desde localStorage
    cartStore.loadFromLocalStorage();
    // 🔥 Cargar datos críticos en paralelo (productos + cotización)
    await Promise.all([
        productsStore.cargarProductos(),
        obtenerCotizacion()
    ]);
    console.log('✅ Aplicación inicializada - Productos y cotización cargados');
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    id: "app",
    ...{ class: "min-h-screen w-screen bg-gray-50 dark:bg-gray-900" },
});
/** @type {[typeof HeaderComponent, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(HeaderComponent, new HeaderComponent({
    ...{ 'onToggleTheme': {} },
    ...{ 'onToggleCart': {} },
    isDark: (__VLS_ctx.isDark),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onToggleTheme': {} },
    ...{ 'onToggleCart': {} },
    isDark: (__VLS_ctx.isDark),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
const __VLS_5 = ({ toggleTheme: {} },
    { onToggleTheme: (__VLS_ctx.toggleTheme) });
const __VLS_6 = ({ toggleCart: {} },
    { onToggleCart: (__VLS_ctx.toggleCart) });
// @ts-ignore
[isDark, toggleTheme, toggleCart,];
var __VLS_2;
__VLS_asFunctionalElement(__VLS_elements.main, __VLS_elements.main)({});
const __VLS_8 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
RouterView;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {[typeof FooterComponent, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(FooterComponent, new FooterComponent({
    ...{ 'onNavigate': {} },
    ...{ 'onSelectCategory': {} },
    ...{ 'onSetCurrency': {} },
    currency: (__VLS_ctx.currentCurrency),
}));
const __VLS_14 = __VLS_13({
    ...{ 'onNavigate': {} },
    ...{ 'onSelectCategory': {} },
    ...{ 'onSetCurrency': {} },
    currency: (__VLS_ctx.currentCurrency),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
const __VLS_18 = ({ navigate: {} },
    { onNavigate: (__VLS_ctx.handleNavigation) });
const __VLS_19 = ({ selectCategory: {} },
    { onSelectCategory: (__VLS_ctx.handleCategorySelect) });
const __VLS_20 = ({ setCurrency: {} },
    { onSetCurrency: (__VLS_ctx.setCurrency) });
// @ts-ignore
[currentCurrency, handleNavigation, handleCategorySelect, setCurrency,];
var __VLS_15;
if (__VLS_ctx.showCart) {
    // @ts-ignore
    [showCart,];
    /** @type {[typeof CartSidebar, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(CartSidebar, new CartSidebar({
        ...{ 'onClose': {} },
        currency: (__VLS_ctx.currentCurrency),
    }));
    const __VLS_23 = __VLS_22({
        ...{ 'onClose': {} },
        currency: (__VLS_ctx.currentCurrency),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = ({ close: {} },
        { onClose: (__VLS_ctx.toggleCart) });
    // @ts-ignore
    [toggleCart, currentCurrency,];
    var __VLS_24;
}
if (__VLS_ctx.showSearchModal) {
    // @ts-ignore
    [showSearchModal,];
    /** @type {[typeof SearchModal, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(SearchModal, new SearchModal({
        ...{ 'onClose': {} },
        ...{ 'onSearch': {} },
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClose': {} },
        ...{ 'onSearch': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    const __VLS_34 = ({ close: {} },
        { onClose: (__VLS_ctx.toggleSearch) });
    const __VLS_35 = ({ search: {} },
        { onSearch: (__VLS_ctx.handleSearch) });
    // @ts-ignore
    [toggleSearch, handleSearch,];
    var __VLS_31;
}
if (__VLS_ctx.notification.show) {
    // @ts-ignore
    [notification,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: ([
                'fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transition-all duration-300 transform',
                __VLS_ctx.notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white',
                __VLS_ctx.notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            ]) },
    });
    // @ts-ignore
    [notification, notification,];
    (__VLS_ctx.notification.message);
    // @ts-ignore
    [notification,];
}
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['w-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        HeaderComponent: HeaderComponent,
        FooterComponent: FooterComponent,
        CartSidebar: CartSidebar,
        SearchModal: SearchModal,
        currentCurrency: currentCurrency,
        isDark: isDark,
        showCart: showCart,
        showSearchModal: showSearchModal,
        notification: notification,
        handleNavigation: handleNavigation,
        handleSearch: handleSearch,
        handleCategorySelect: handleCategorySelect,
        toggleCart: toggleCart,
        toggleSearch: toggleSearch,
        toggleTheme: toggleTheme,
        setCurrency: setCurrency,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
