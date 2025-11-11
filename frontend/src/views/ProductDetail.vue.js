/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronRightIcon, ShoppingCartIcon, MinusIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { useCartStore } from '../stores/cart';
import { useProductsStore } from '../stores/products';
import { useCotizacion } from '../services/cotizacionService';
const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const productsStore = useProductsStore();
const cotizacionUSD = ref(42);
const cotizacionCargando = ref(true);
const { obtenerCotizacion } = useCotizacion();
const producto = ref(null);
const loading = ref(true);
const error = ref(null);
const quantity = ref(1);
const imagenActualIndex = ref(0);
const thumbnailStartIndex = ref(0);
const autoplayInterval = ref(null);
const isAutoplayPaused = ref(false);
const productosRelacionados = ref([]);
const THUMBNAIL_MAX_VISIBLE = 6;
const AUTOPLAY_DELAY = 4000; // 4 segundos
const cargarCotizacion = async () => {
    try {
        cotizacionCargando.value = true;
        const valor = await obtenerCotizacion();
        cotizacionUSD.value = valor;
        console.log('✅ Cotización cargada en detalle:', valor);
    }
    catch (error) {
        console.error('❌ Error al cargar cotización:', error);
    }
    finally {
        cotizacionCargando.value = false;
    }
};
const formatearPrecio = (precio) => {
    return Math.round(precio).toLocaleString('es-UY');
};
const todasLasImagenes = computed(() => {
    if (!producto.value)
        return [];
    // Usar las imágenes del producto (ordenadas por display_order e is_primary)
    return producto.value.images.map(img => img.url).filter(Boolean);
});
const imagenActual = computed(() => {
    return todasLasImagenes.value[imagenActualIndex.value] || '';
});
const thumbnailsVisibles = computed(() => {
    const start = thumbnailStartIndex.value;
    const end = start + THUMBNAIL_MAX_VISIBLE;
    return todasLasImagenes.value.slice(start, end);
});
const canScrollThumbnailsLeft = computed(() => {
    return thumbnailStartIndex.value > 0;
});
const canScrollThumbnailsRight = computed(() => {
    return thumbnailStartIndex.value + THUMBNAIL_MAX_VISIBLE < todasLasImagenes.value.length;
});
const thumbnailRealIndex = (visibleIndex) => {
    return thumbnailStartIndex.value + visibleIndex;
};
const precioTotal = computed(() => {
    if (!producto.value || !producto.value.precio_metro || !producto.value.metros_por_caja)
        return 0;
    return parseInt((producto.value.precio_metro * producto.value.metros_por_caja).toFixed(2));
});
const precioTotalUYU = computed(() => {
    return precioTotal.value * cotizacionUSD.value;
});
const precioMetroUYU = computed(() => {
    if (!producto.value || !producto.value.precio_metro)
        return 0;
    return producto.value.precio_metro * cotizacionUSD.value;
});
const stockBadgeClass = computed(() => {
    if (!producto.value || producto.value.stock === null)
        return 'bg-gray-100 text-gray-800';
    if (producto.value.stock > 50)
        return 'bg-green-100 text-green-800';
    if (producto.value.stock > 10)
        return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
});
const cargarProducto = async () => {
    loading.value = true;
    error.value = null;
    try {
        const slug = route.params.productSlug;
        if (!slug) {
            error.value = 'No se especificó un producto';
            loading.value = false;
            return;
        }
        console.log('Buscando producto con slug:', slug);
        // Cargar productos si no están cargados
        if (!productsStore.initialized) {
            await productsStore.cargarProductos();
        }
        // Buscar producto por slug (formato completo con todas las relaciones)
        const found = productsStore.getProductoBySlug(String(slug));
        if (found) {
            console.log('Producto encontrado:', found.nombre);
            producto.value = found;
            imagenActualIndex.value = 0;
            thumbnailStartIndex.value = 0;
            // Iniciar autoplay si hay múltiples imágenes
            if (todasLasImagenes.value.length > 1) {
                startAutoplay();
            }
            // Cargar productos relacionados
            if (found.categories.length > 0) {
                const categoria = found.categories[0]?.slug || '';
                productosRelacionados.value = productsStore
                    .getProductosByCategoria(categoria)
                    .filter(p => p.id !== found.id)
                    .slice(0, 4);
            }
        }
        else {
            console.error('Producto no encontrado con slug:', slug);
            error.value = 'Producto no encontrado';
        }
    }
    catch (err) {
        console.error('Error al cargar producto:', err);
        error.value = err instanceof Error ? err.message : 'Error al cargar el producto';
    }
    finally {
        loading.value = false;
    }
};
const incrementQuantity = () => {
    if (producto.value && producto.value.stock !== null && quantity.value < producto.value.stock) {
        quantity.value++;
    }
};
const decrementQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};
const nextImage = () => {
    if (imagenActualIndex.value < todasLasImagenes.value.length - 1) {
        imagenActualIndex.value++;
    }
    else {
        imagenActualIndex.value = 0; // Volver al inicio
    }
    adjustThumbnailScroll();
};
const prevImage = () => {
    if (imagenActualIndex.value > 0) {
        imagenActualIndex.value--;
    }
    else {
        imagenActualIndex.value = todasLasImagenes.value.length - 1; // Ir al final
    }
    adjustThumbnailScroll();
};
const selectThumbnail = (index) => {
    imagenActualIndex.value = index;
    pauseAutoplay();
};
const scrollThumbnailsLeft = () => {
    thumbnailStartIndex.value = Math.max(0, thumbnailStartIndex.value - THUMBNAIL_MAX_VISIBLE);
};
const scrollThumbnailsRight = () => {
    const maxStart = Math.max(0, todasLasImagenes.value.length - THUMBNAIL_MAX_VISIBLE);
    thumbnailStartIndex.value = Math.min(maxStart, thumbnailStartIndex.value + THUMBNAIL_MAX_VISIBLE);
};
const adjustThumbnailScroll = () => {
    const currentPage = Math.floor(imagenActualIndex.value / THUMBNAIL_MAX_VISIBLE);
    thumbnailStartIndex.value = currentPage * THUMBNAIL_MAX_VISIBLE;
};
const startAutoplay = () => {
    if (todasLasImagenes.value.length <= 1)
        return;
    stopAutoplay();
    isAutoplayPaused.value = false;
    autoplayInterval.value = setInterval(() => {
        nextImage();
    }, AUTOPLAY_DELAY);
};
const stopAutoplay = () => {
    if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value);
        autoplayInterval.value = null;
    }
};
const pauseAutoplay = () => {
    isAutoplayPaused.value = true;
    stopAutoplay();
};
const toggleAutoplay = () => {
    if (isAutoplayPaused.value) {
        startAutoplay();
    }
    else {
        pauseAutoplay();
    }
};
const addToCart = () => {
    if (producto.value) {
        // Convertir a formato ProductoAPI para el carrito
        const productoParaCarrito = productsStore.transformarProducto(producto.value);
        for (let i = 0; i < quantity.value; i++) {
            cartStore.addItem(productoParaCarrito);
        }
        quantity.value = 1;
    }
};
const goToProduct = (prod) => {
    router.push(`/producto/${prod.slug}`);
};
watch(() => route.params.productSlug, () => {
    if (route.params.productSlug) {
        cargarProducto();
        window.scrollTo(0, 0);
    }
});
onMounted(async () => {
    await Promise.all([
        cargarProducto(),
        cargarCotizacion()
    ]);
});
onUnmounted(() => {
    stopAutoplay();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "min-h-screen bg-gray-50 dark:bg-gray-900" },
});
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "flex justify-center items-center min-h-screen" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" },
    });
}
else if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "max-w-7xl mx-auto px-4 py-20 text-center" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "text-red-600 dark:text-red-400 mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
        ...{ class: "w-16 h-16 mx-auto mb-4" },
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
    });
    __VLS_asFunctionalElement(__VLS_elements.path, __VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "text-xl font-semibold" },
    });
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        to: "/",
        ...{ class: "text-blue-600 dark:text-blue-400 hover:underline" },
    }));
    const __VLS_2 = __VLS_1({
        to: "/",
        ...{ class: "text-blue-600 dark:text-blue-400 hover:underline" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_4 } = __VLS_3.slots;
    var __VLS_3;
}
else if (__VLS_ctx.producto) {
    // @ts-ignore
    [producto,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" },
    });
    __VLS_asFunctionalElement(__VLS_elements.nav, __VLS_elements.nav)({
        ...{ class: "flex mb-8" },
        'aria-label': "Breadcrumb",
    });
    __VLS_asFunctionalElement(__VLS_elements.ol, __VLS_elements.ol)({
        ...{ class: "flex items-center space-x-2 text-sm" },
    });
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    const __VLS_5 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        to: "/",
        ...{ class: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" },
    }));
    const __VLS_7 = __VLS_6({
        to: "/",
        ...{ class: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    const { default: __VLS_9 } = __VLS_8.slots;
    var __VLS_8;
    const __VLS_10 = {}.ChevronRightIcon;
    /** @type {[typeof __VLS_components.ChevronRightIcon, ]} */ ;
    // @ts-ignore
    ChevronRightIcon;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        ...{ class: "w-4 h-4 text-gray-400" },
    }));
    const __VLS_12 = __VLS_11({
        ...{ class: "w-4 h-4 text-gray-400" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    if (__VLS_ctx.producto.categories[0]) {
        // @ts-ignore
        [producto,];
        __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
        const __VLS_15 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        RouterLink;
        // @ts-ignore
        const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
            to: (`/categoria/${__VLS_ctx.producto.categories[0].slug}`),
            ...{ class: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" },
        }));
        const __VLS_17 = __VLS_16({
            to: (`/categoria/${__VLS_ctx.producto.categories[0].slug}`),
            ...{ class: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_16));
        const { default: __VLS_19 } = __VLS_18.slots;
        // @ts-ignore
        [producto,];
        (__VLS_ctx.producto.categories[0].name);
        // @ts-ignore
        [producto,];
        var __VLS_18;
    }
    const __VLS_20 = {}.ChevronRightIcon;
    /** @type {[typeof __VLS_components.ChevronRightIcon, ]} */ ;
    // @ts-ignore
    ChevronRightIcon;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ class: "w-4 h-4 text-gray-400" },
    }));
    const __VLS_22 = __VLS_21({
        ...{ class: "w-4 h-4 text-gray-400" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
        ...{ class: "text-gray-900 dark:text-white font-medium" },
    });
    (__VLS_ctx.producto.nombre);
    // @ts-ignore
    [producto,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden group" },
    });
    if (__VLS_ctx.imagenActual) {
        // @ts-ignore
        [imagenActual,];
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: (__VLS_ctx.imagenActual),
            alt: (__VLS_ctx.producto.nombre),
            ...{ class: "w-full h-full object-cover" },
        });
        // @ts-ignore
        [producto, imagenActual,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "w-full h-full flex items-center justify-center" },
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "text-6xl" },
        });
    }
    if (__VLS_ctx.todasLasImagenes.length > 1) {
        // @ts-ignore
        [todasLasImagenes,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.prevImage) },
            ...{ class: "absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" },
        });
        // @ts-ignore
        [prevImage,];
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
            ...{ class: "w-6 h-6" },
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
        });
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M15 19l-7-7 7-7",
        });
    }
    if (__VLS_ctx.todasLasImagenes.length > 1) {
        // @ts-ignore
        [todasLasImagenes,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.nextImage) },
            ...{ class: "absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" },
        });
        // @ts-ignore
        [nextImage,];
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
            ...{ class: "w-6 h-6" },
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
        });
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M9 5l7 7-7 7",
        });
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "absolute top-4 left-4 flex flex-col gap-2" },
    });
    if (__VLS_ctx.producto.nuevo) {
        // @ts-ignore
        [producto,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-bold" },
        });
    }
    if (__VLS_ctx.producto.en_oferta) {
        // @ts-ignore
        [producto,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold" },
        });
    }
    if (__VLS_ctx.producto.destacado) {
        // @ts-ignore
        [producto,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold" },
        });
    }
    if (__VLS_ctx.todasLasImagenes.length > 1) {
        // @ts-ignore
        [todasLasImagenes,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.toggleAutoplay) },
            ...{ class: "absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full" },
            title: (__VLS_ctx.isAutoplayPaused ? 'Reproducir' : 'Pausar'),
        });
        // @ts-ignore
        [toggleAutoplay, isAutoplayPaused,];
        if (__VLS_ctx.isAutoplayPaused) {
            // @ts-ignore
            [isAutoplayPaused,];
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
                ...{ class: "w-5 h-5" },
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
            });
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z",
            });
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
                ...{ class: "w-5 h-5" },
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
            });
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z",
            });
        }
    }
    if (__VLS_ctx.todasLasImagenes.length > 1) {
        // @ts-ignore
        [todasLasImagenes,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "relative" },
        });
        if (__VLS_ctx.canScrollThumbnailsLeft) {
            // @ts-ignore
            [canScrollThumbnailsLeft,];
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                ...{ onClick: (__VLS_ctx.scrollThumbnailsLeft) },
                ...{ class: "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-1 rounded-full shadow-lg" },
            });
            // @ts-ignore
            [scrollThumbnailsLeft,];
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
                ...{ class: "w-4 h-4" },
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
            });
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M15 19l-7-7 7-7",
            });
        }
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "grid grid-cols-6 gap-2" },
        });
        for (const [img, index] of __VLS_getVForSourceType((__VLS_ctx.thumbnailsVisibles))) {
            // @ts-ignore
            [thumbnailsVisibles,];
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(__VLS_ctx.error))
                            return;
                        if (!(__VLS_ctx.producto))
                            return;
                        if (!(__VLS_ctx.todasLasImagenes.length > 1))
                            return;
                        __VLS_ctx.selectThumbnail(__VLS_ctx.thumbnailRealIndex(index));
                        // @ts-ignore
                        [selectThumbnail, thumbnailRealIndex,];
                    } },
                key: (index),
                ...{ class: ([
                        'aspect-square rounded-lg overflow-hidden border-2 transition-all',
                        __VLS_ctx.thumbnailRealIndex(index) === __VLS_ctx.imagenActualIndex
                            ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                    ]) },
            });
            // @ts-ignore
            [thumbnailRealIndex, imagenActualIndex,];
            __VLS_asFunctionalElement(__VLS_elements.img)({
                src: (img),
                alt: (`Vista ${__VLS_ctx.thumbnailRealIndex(index) + 1}`),
                ...{ class: "w-full h-full object-cover" },
            });
            // @ts-ignore
            [thumbnailRealIndex,];
        }
        if (__VLS_ctx.canScrollThumbnailsRight) {
            // @ts-ignore
            [canScrollThumbnailsRight,];
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                ...{ onClick: (__VLS_ctx.scrollThumbnailsRight) },
                ...{ class: "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-1 rounded-full shadow-lg" },
            });
            // @ts-ignore
            [scrollThumbnailsRight,];
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
                ...{ class: "w-4 h-4" },
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
            });
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M9 5l7 7-7 7",
            });
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "space-y-6" },
    });
    if (__VLS_ctx.producto.brand) {
        // @ts-ignore
        [producto,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "text-sm text-blue-600 dark:text-blue-400 font-semibold" },
        });
        (__VLS_ctx.producto.brand.name);
        // @ts-ignore
        [producto,];
    }
    __VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
        ...{ class: "text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white" },
    });
    (__VLS_ctx.producto.nombre);
    // @ts-ignore
    [producto,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "text-sm text-gray-600 dark:text-gray-400" },
    });
    (__VLS_ctx.producto.sku);
    // @ts-ignore
    [producto,];
    if (__VLS_ctx.producto.descripcion) {
        // @ts-ignore
        [producto,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "text-gray-700 dark:text-gray-300 leading-relaxed" },
        });
        (__VLS_ctx.producto.descripcion);
        // @ts-ignore
        [producto,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "bg-gray-50 dark:bg-gray-800 rounded-xl p-6" },
    });
    if (__VLS_ctx.producto.precio_anterior && __VLS_ctx.producto.precio_anterior > __VLS_ctx.precioTotal) {
        // @ts-ignore
        [producto, producto, precioTotal,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "mb-2" },
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "text-lg text-gray-500 line-through" },
        });
        (__VLS_ctx.formatearPrecio(__VLS_ctx.producto.precio_anterior * __VLS_ctx.cotizacionUSD));
        // @ts-ignore
        [producto, formatearPrecio, cotizacionUSD,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "ml-2 text-sm bg-red-100 text-red-800 px-2 py-1 rounded-lg font-medium" },
        });
        (Math.round(((__VLS_ctx.producto.precio_anterior - __VLS_ctx.precioTotal) / __VLS_ctx.producto.precio_anterior) * 100));
        // @ts-ignore
        [producto, producto, precioTotal,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "flex items-baseline gap-3 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "text-4xl font-bold text-gray-900 dark:text-white" },
    });
    (__VLS_ctx.formatearPrecio(__VLS_ctx.precioTotalUYU));
    // @ts-ignore
    [formatearPrecio, precioTotalUYU,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "text-lg text-gray-600 dark:text-gray-400" },
    });
    if (__VLS_ctx.producto.precio_metro) {
        // @ts-ignore
        [producto,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "text-gray-600 dark:text-gray-400" },
        });
        (__VLS_ctx.formatearPrecio(__VLS_ctx.precioMetroUYU));
        // @ts-ignore
        [formatearPrecio, precioMetroUYU,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "border-t border-b border-gray-200 dark:border-gray-700 py-6 space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "font-semibold text-gray-900 dark:text-white" },
    });
    __VLS_asFunctionalElement(__VLS_elements.dl, __VLS_elements.dl)({
        ...{ class: "grid grid-cols-2 gap-4 text-sm" },
    });
    if (__VLS_ctx.producto.medidas) {
        // @ts-ignore
        [producto,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        __VLS_asFunctionalElement(__VLS_elements.dt, __VLS_elements.dt)({
            ...{ class: "text-gray-600 dark:text-gray-400" },
        });
        __VLS_asFunctionalElement(__VLS_elements.dd, __VLS_elements.dd)({
            ...{ class: "font-medium text-gray-900 dark:text-white" },
        });
        (__VLS_ctx.producto.medidas);
        // @ts-ignore
        [producto,];
    }
    if (__VLS_ctx.producto.color) {
        // @ts-ignore
        [producto,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        __VLS_asFunctionalElement(__VLS_elements.dt, __VLS_elements.dt)({
            ...{ class: "text-gray-600 dark:text-gray-400" },
        });
        __VLS_asFunctionalElement(__VLS_elements.dd, __VLS_elements.dd)({
            ...{ class: "font-medium text-gray-900 dark:text-white flex items-center gap-2" },
        });
        if (__VLS_ctx.producto.color.hex_code) {
            // @ts-ignore
            [producto,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                ...{ style: ({ backgroundColor: __VLS_ctx.producto.color.hex_code }) },
                ...{ class: "w-4 h-4 rounded-full border border-gray-300" },
            });
            // @ts-ignore
            [producto,];
        }
        (__VLS_ctx.producto.color.name);
        // @ts-ignore
        [producto,];
    }
    if (__VLS_ctx.producto.material) {
        // @ts-ignore
        [producto,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        __VLS_asFunctionalElement(__VLS_elements.dt, __VLS_elements.dt)({
            ...{ class: "text-gray-600 dark:text-gray-400" },
        });
        __VLS_asFunctionalElement(__VLS_elements.dd, __VLS_elements.dd)({
            ...{ class: "font-medium text-gray-900 dark:text-white" },
        });
        (__VLS_ctx.producto.material.name);
        // @ts-ignore
        [producto,];
    }
    if (__VLS_ctx.producto.pei) {
        // @ts-ignore
        [producto,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        __VLS_asFunctionalElement(__VLS_elements.dt, __VLS_elements.dt)({
            ...{ class: "text-gray-600 dark:text-gray-400" },
        });
        __VLS_asFunctionalElement(__VLS_elements.dd, __VLS_elements.dd)({
            ...{ class: "font-medium text-gray-900 dark:text-white" },
        });
        (__VLS_ctx.producto.pei);
        // @ts-ignore
        [producto,];
    }
    if (__VLS_ctx.producto.metros_por_caja) {
        // @ts-ignore
        [producto,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        __VLS_asFunctionalElement(__VLS_elements.dt, __VLS_elements.dt)({
            ...{ class: "text-gray-600 dark:text-gray-400" },
        });
        __VLS_asFunctionalElement(__VLS_elements.dd, __VLS_elements.dd)({
            ...{ class: "font-medium text-gray-900 dark:text-white" },
        });
        (__VLS_ctx.producto.metros_por_caja);
        // @ts-ignore
        [producto,];
    }
    if (__VLS_ctx.producto.unidad) {
        // @ts-ignore
        [producto,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        __VLS_asFunctionalElement(__VLS_elements.dt, __VLS_elements.dt)({
            ...{ class: "text-gray-600 dark:text-gray-400" },
        });
        __VLS_asFunctionalElement(__VLS_elements.dd, __VLS_elements.dd)({
            ...{ class: "font-medium text-gray-900 dark:text-white" },
        });
        (__VLS_ctx.producto.unidad);
        // @ts-ignore
        [producto,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: (['inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', __VLS_ctx.stockBadgeClass]) },
    });
    // @ts-ignore
    [stockBadgeClass,];
    if (__VLS_ctx.producto.stock !== null) {
        // @ts-ignore
        [producto,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "ml-2" },
        });
        (__VLS_ctx.producto.stock);
        (__VLS_ctx.producto.unidad || 'unidades');
        // @ts-ignore
        [producto, producto,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "flex items-center gap-4" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "flex items-center border border-gray-300 dark:border-gray-600 rounded-lg" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.decrementQuantity) },
        ...{ class: "p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" },
        disabled: (__VLS_ctx.quantity <= 1),
    });
    // @ts-ignore
    [decrementQuantity, quantity,];
    const __VLS_25 = {}.MinusIcon;
    /** @type {[typeof __VLS_components.MinusIcon, ]} */ ;
    // @ts-ignore
    MinusIcon;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        ...{ class: "w-5 h-5" },
    }));
    const __VLS_27 = __VLS_26({
        ...{ class: "w-5 h-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "px-6 font-medium" },
    });
    (__VLS_ctx.quantity);
    // @ts-ignore
    [quantity,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.incrementQuantity) },
        ...{ class: "p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" },
        disabled: (__VLS_ctx.producto.stock !== null && __VLS_ctx.quantity >= __VLS_ctx.producto.stock),
    });
    // @ts-ignore
    [producto, producto, quantity, incrementQuantity,];
    const __VLS_30 = {}.PlusIcon;
    /** @type {[typeof __VLS_components.PlusIcon, ]} */ ;
    // @ts-ignore
    PlusIcon;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
        ...{ class: "w-5 h-5" },
    }));
    const __VLS_32 = __VLS_31({
        ...{ class: "w-5 h-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.addToCart) },
        disabled: (__VLS_ctx.producto.stock === 0),
        ...{ class: "flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2" },
    });
    // @ts-ignore
    [producto, addToCart,];
    const __VLS_35 = {}.ShoppingCartIcon;
    /** @type {[typeof __VLS_components.ShoppingCartIcon, ]} */ ;
    // @ts-ignore
    ShoppingCartIcon;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
        ...{ class: "w-5 h-5" },
    }));
    const __VLS_37 = __VLS_36({
        ...{ class: "w-5 h-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    if (__VLS_ctx.producto.tags.length > 0) {
        // @ts-ignore
        [producto,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "flex flex-wrap gap-2" },
        });
        for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.producto.tags))) {
            // @ts-ignore
            [producto,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                key: (tag.id),
                ...{ class: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg text-sm" },
            });
            (tag.name);
        }
    }
    if (__VLS_ctx.productosRelacionados.length > 0) {
        // @ts-ignore
        [productosRelacionados,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "mt-16" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
            ...{ class: "text-2xl font-bold text-gray-900 dark:text-white mb-6" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" },
        });
        for (const [prod] of __VLS_getVForSourceType((__VLS_ctx.productosRelacionados))) {
            // @ts-ignore
            [productosRelacionados,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(__VLS_ctx.error))
                            return;
                        if (!(__VLS_ctx.producto))
                            return;
                        if (!(__VLS_ctx.productosRelacionados.length > 0))
                            return;
                        __VLS_ctx.goToProduct(prod);
                        // @ts-ignore
                        [goToProduct,];
                    } },
                key: (prod.id),
                ...{ class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group" },
            });
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "relative aspect-square bg-gray-100 dark:bg-gray-700" },
            });
            if (prod.images[0]) {
                __VLS_asFunctionalElement(__VLS_elements.img)({
                    src: (prod.images[0].url),
                    alt: (prod.nombre),
                    ...{ class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" },
                });
            }
            else {
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    ...{ class: "w-full h-full flex items-center justify-center" },
                });
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                    ...{ class: "text-4xl" },
                });
            }
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "p-4" },
            });
            if (prod.brand) {
                __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
                    ...{ class: "text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1" },
                });
                (prod.brand.name);
            }
            __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
                ...{ class: "font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2" },
            });
            (prod.nombre);
            if (prod.precio_metro) {
                __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
                    ...{ class: "text-lg font-bold text-gray-900 dark:text-white" },
                });
                (__VLS_ctx.formatearPrecio((prod.precio_metro * (prod.metros_por_caja || 1)) * __VLS_ctx.cotizacionUSD));
                // @ts-ignore
                [formatearPrecio, cotizacionUSD,];
            }
        }
    }
}
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:gap-12']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-square']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-6xl']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-4']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/90']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800/90']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/90']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800/90']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['left-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/90']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800/90']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-6']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-square']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['line-through']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-800']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-baseline']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:bg-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-square']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['line-clamp-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        ChevronRightIcon: ChevronRightIcon,
        ShoppingCartIcon: ShoppingCartIcon,
        MinusIcon: MinusIcon,
        PlusIcon: PlusIcon,
        cotizacionUSD: cotizacionUSD,
        producto: producto,
        loading: loading,
        error: error,
        quantity: quantity,
        imagenActualIndex: imagenActualIndex,
        isAutoplayPaused: isAutoplayPaused,
        productosRelacionados: productosRelacionados,
        formatearPrecio: formatearPrecio,
        todasLasImagenes: todasLasImagenes,
        imagenActual: imagenActual,
        thumbnailsVisibles: thumbnailsVisibles,
        canScrollThumbnailsLeft: canScrollThumbnailsLeft,
        canScrollThumbnailsRight: canScrollThumbnailsRight,
        thumbnailRealIndex: thumbnailRealIndex,
        precioTotal: precioTotal,
        precioTotalUYU: precioTotalUYU,
        precioMetroUYU: precioMetroUYU,
        stockBadgeClass: stockBadgeClass,
        incrementQuantity: incrementQuantity,
        decrementQuantity: decrementQuantity,
        nextImage: nextImage,
        prevImage: prevImage,
        selectThumbnail: selectThumbnail,
        scrollThumbnailsLeft: scrollThumbnailsLeft,
        scrollThumbnailsRight: scrollThumbnailsRight,
        toggleAutoplay: toggleAutoplay,
        addToCart: addToCart,
        goToProduct: goToProduct,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
