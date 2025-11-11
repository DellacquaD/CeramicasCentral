import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../lib/supabase';
export const useProductsStore = defineStore('products', () => {
    // Estado
    const productos = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const initialized = ref(false);
    // Caches para las tablas de referencia
    const brands = ref([]);
    const categories = ref([]);
    const subcategories = ref([]);
    const colors = ref([]);
    const materials = ref([]);
    const tags = ref([]);
    // Computed
    const productosActivos = computed(() => productos.value.filter(p => p.disponible && p.activo));
    const productosFormateados = computed(() => {
        return productos.value.map((p) => transformarProducto(p));
    });
    const productosActivosFormateados = computed(() => {
        return productosActivos.value.map((p) => transformarProducto(p));
    });
    // Transformar producto completo al formato antiguo
    const transformarProducto = (producto) => {
        return {
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            marca: producto.brand?.name || '',
            categoria: producto.categories.map((c) => c.name),
            subcategoria: producto.subcategories.find((s) => s)?.name,
            precio: producto.precio,
            precioMetro: producto.precio_metro,
            precioAnterior: producto.precio_anterior,
            metrosPorCaja: producto.metros_por_caja,
            stock: producto.stock,
            unidad: producto.unidad,
            medidas: producto.medidas,
            color: producto.color?.name,
            pei: producto.pei,
            imagenPrincipal: producto.images.find((img) => img.is_primary)?.url || producto.images[0]?.url,
            disponible: producto.disponible ?? false,
            activo: producto.activo ?? false,
            nuevo: producto.nuevo ?? false,
            enOferta: producto.en_oferta ?? false,
            slug: producto.slug,
            tags: producto.tags.map((t) => t.name),
            destacado: producto.destacado ?? false
        };
    };
    // Cargar todas las tablas de referencia
    const cargarReferencias = async () => {
        try {
            const [brandsData, categoriesData, subcategoriesData, colorsData, materialsData, tagsData] = await Promise.all([
                supabase.from('brands').select('*').eq('is_active', true),
                supabase.from('categories').select('*').eq('is_active', true),
                supabase.from('subcategories').select('*').eq('is_active', true),
                supabase.from('colors').select('*'),
                supabase.from('materials').select('*'),
                supabase.from('tags').select('*')
            ]);
            if (brandsData.data)
                brands.value = brandsData.data;
            if (categoriesData.data)
                categories.value = categoriesData.data;
            if (subcategoriesData.data)
                subcategories.value = subcategoriesData.data;
            if (colorsData.data)
                colors.value = colorsData.data;
            if (materialsData.data)
                materials.value = materialsData.data;
            if (tagsData.data)
                tags.value = tagsData.data;
        }
        catch (err) {
            console.error('❌ Error al cargar referencias:', err);
            throw err;
        }
    };
    // Cargar productos con todas sus relaciones
    const cargarProductos = async (forzar = false) => {
        // Si ya están cargados y no se fuerza, no hacer nada
        if (initialized.value && !forzar) {
            console.log('✅ Productos ya cargados, usando caché local');
            return;
        }
        loading.value = true;
        error.value = null;
        try {
            console.log('🔄 Cargando productos desde Supabase...');
            // Primero cargar las referencias si no están cargadas
            if (brands.value.length === 0) {
                await cargarReferencias();
            }
            // Cargar productos con sus relaciones
            const { data: productosData, error: productosError } = await supabase
                .from('products')
                .select(`
                    *,
                    brand:brands(*),
                    color:colors(*),
                    material:materials(*),
                    images:product_images(*),
                    product_categories(
                        category:categories(*)
                    ),
                    product_subcategories(
                        subcategory:subcategories(*)
                    ),
                    product_tags(
                        tag:tags(*)
                    )
                `)
                .eq('activo', true)
                .eq('disponible', true)
                .order('created_at', { ascending: false });
            if (productosError)
                throw productosError;
            // Transformar la estructura de datos
            if (productosData) {
                productos.value = productosData.map(p => ({
                    ...p,
                    brand: p.brand || undefined,
                    color: p.color || undefined,
                    material: p.material || undefined,
                    images: (p.images || []).sort((a, b) => {
                        if (a.is_primary && !b.is_primary)
                            return -1;
                        if (!a.is_primary && b.is_primary)
                            return 1;
                        return (a.display_order || 0) - (b.display_order || 0);
                    }),
                    categories: (p.product_categories || [])
                        .map((pc) => pc.category)
                        .filter(Boolean),
                    subcategories: (p.product_subcategories || [])
                        .map((ps) => ps.subcategory)
                        .filter(Boolean),
                    tags: (p.product_tags || [])
                        .map((pt) => pt.tag)
                        .filter(Boolean)
                }));
                initialized.value = true;
                console.log('✅ Productos cargados:', productos.value.length);
            }
        }
        catch (err) {
            console.error('❌ Error al cargar productos:', err);
            error.value = err instanceof Error ? err.message : 'Error desconocido';
        }
        finally {
            loading.value = false;
        }
    };
    // Obtener producto por slug (formato completo)
    const getProductoBySlug = (slug) => {
        return productos.value.find(p => p.slug === slug);
    };
    // Obtener producto por slug (formato antiguo para compatibilidad)
    const getProductoBySlugFormateado = (slug) => {
        const producto = getProductoBySlug(slug);
        return producto ? transformarProducto(producto) : undefined;
    };
    // Obtener productos por categoría (formato completo)
    const getProductosByCategoria = (categoria) => {
        const categoriaLower = categoria.toLowerCase();
        return productosActivos.value.filter(p => p.categories.some((cat) => cat.name.toLowerCase() === categoriaLower ||
            cat.slug.toLowerCase() === categoriaLower));
    };
    // Obtener productos por categoría (formato antiguo)
    const getProductosByCategoriaFormateado = (categoria) => {
        return getProductosByCategoria(categoria).map((p) => transformarProducto(p));
    };
    // Obtener productos por subcategoría
    const getProductosBySubcategoria = (subcategoria) => {
        const subcategoriaLower = subcategoria.toLowerCase();
        return productosActivos.value.filter(p => p.subcategories.some((sub) => sub.name.toLowerCase() === subcategoriaLower ||
            sub.slug.toLowerCase() === subcategoriaLower));
    };
    // Obtener productos por marca
    const getProductosByMarca = (marca) => {
        const marcaLower = marca.toLowerCase();
        return productosActivos.value.filter(p => p.brand?.name.toLowerCase() === marcaLower ||
            p.brand?.slug.toLowerCase() === marcaLower);
    };
    // Obtener productos por tag
    const getProductosByTag = (tag) => {
        const tagLower = tag.toLowerCase();
        return productosActivos.value.filter(p => p.tags.some((t) => t.name.toLowerCase() === tagLower ||
            t.slug.toLowerCase() === tagLower));
    };
    // Obtener productos destacados
    const getProductosDestacados = () => {
        return productosActivos.value.filter(p => p.destacado);
    };
    // Obtener productos nuevos
    const getProductosNuevos = () => {
        return productosActivos.value.filter(p => p.nuevo);
    };
    // Obtener productos en oferta
    const getProductosEnOferta = () => {
        return productosActivos.value.filter(p => p.en_oferta);
    };
    // Buscar productos
    const buscarProductos = (termino) => {
        const terminoLower = termino.toLowerCase();
        return productosActivos.value.filter(p => p.nombre.toLowerCase().includes(terminoLower) ||
            p.descripcion?.toLowerCase().includes(terminoLower) ||
            p.sku.toLowerCase().includes(terminoLower) ||
            p.brand?.name.toLowerCase().includes(terminoLower) ||
            p.categories.some((c) => c.name.toLowerCase().includes(terminoLower)) ||
            p.tags.some((t) => t.name.toLowerCase().includes(terminoLower)));
    };
    return {
        // Estado
        productos,
        loading,
        error,
        initialized,
        // Referencias
        brands,
        categories,
        subcategories,
        colors,
        materials,
        tags,
        // Computed
        productosActivos,
        productosFormateados,
        productosActivosFormateados,
        // Métodos
        cargarProductos,
        cargarReferencias,
        // Getters formato completo
        getProductoBySlug,
        getProductosByCategoria,
        getProductosBySubcategoria,
        getProductosByMarca,
        getProductosByTag,
        getProductosDestacados,
        getProductosNuevos,
        getProductosEnOferta,
        buscarProductos,
        // Getters formato antiguo (para compatibilidad)
        getProductoBySlugFormateado,
        getProductosByCategoriaFormateado,
        // Utilidades
        transformarProducto
    };
});
