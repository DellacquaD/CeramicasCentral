/**
 * Composables y utilidades para trabajar con productos
 */
import { type ComputedRef } from 'vue';
import type { ProductoCompleto, ProductoAPI } from '../stores/products';
/**
 * Composable para gestionar productos con loading automático
 */
export declare function useProducts(): {
    store: import("pinia").Store<"products", Pick<{
        productos: import("vue").Ref<{
            id: string;
            nombre: string;
            descripcion: string | null;
            sku: string;
            slug: string;
            precio: number;
            precio_anterior: number | null;
            precio_metro: number | null;
            stock: number | null;
            unidad: string | null;
            medidas: string | null;
            metros_por_caja: number | null;
            moneda: string | null;
            pei: string | null;
            activo: boolean | null;
            disponible: boolean | null;
            nuevo: boolean | null;
            en_oferta: boolean | null;
            destacado: boolean | null;
            created_at: string | null;
            updated_at: string | null;
            fecha_creacion: string | null;
            fecha_actualizacion: string | null;
            brand_id: string | null;
            color_id: string | null;
            material_id: string | null;
            brand?: {
                created_at: string | null;
                description: string | null;
                id: string;
                is_active: boolean | null;
                logo_url: string | null;
                name: string;
                slug: string;
                updated_at: string | null;
            } | undefined;
            color?: {
                created_at: string | null;
                hex_code: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            material?: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            images: {
                alt_text: string | null;
                created_at: string | null;
                display_order: number | null;
                id: string;
                is_primary: boolean | null;
                product_id: string;
                url: string;
            }[];
            categories: {
                created_at: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            subcategories: {
                category_id: string;
                created_at: string | null;
                description: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            tags: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            }[];
        }[], ProductoCompleto[] | {
            id: string;
            nombre: string;
            descripcion: string | null;
            sku: string;
            slug: string;
            precio: number;
            precio_anterior: number | null;
            precio_metro: number | null;
            stock: number | null;
            unidad: string | null;
            medidas: string | null;
            metros_por_caja: number | null;
            moneda: string | null;
            pei: string | null;
            activo: boolean | null;
            disponible: boolean | null;
            nuevo: boolean | null;
            en_oferta: boolean | null;
            destacado: boolean | null;
            created_at: string | null;
            updated_at: string | null;
            fecha_creacion: string | null;
            fecha_actualizacion: string | null;
            brand_id: string | null;
            color_id: string | null;
            material_id: string | null;
            brand?: {
                created_at: string | null;
                description: string | null;
                id: string;
                is_active: boolean | null;
                logo_url: string | null;
                name: string;
                slug: string;
                updated_at: string | null;
            } | undefined;
            color?: {
                created_at: string | null;
                hex_code: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            material?: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            images: {
                alt_text: string | null;
                created_at: string | null;
                display_order: number | null;
                id: string;
                is_primary: boolean | null;
                product_id: string;
                url: string;
            }[];
            categories: {
                created_at: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            subcategories: {
                category_id: string;
                created_at: string | null;
                description: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            tags: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            }[];
        }[]>;
        loading: import("vue").Ref<boolean, boolean>;
        error: import("vue").Ref<string | null, string | null>;
        initialized: import("vue").Ref<boolean, boolean>;
        brands: import("vue").Ref<{
            created_at: string | null;
            description: string | null;
            id: string;
            is_active: boolean | null;
            logo_url: string | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[], {
            created_at: string | null;
            description: string | null;
            id: string;
            is_active: boolean | null;
            logo_url: string | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[] | {
            created_at: string | null;
            description: string | null;
            id: string;
            is_active: boolean | null;
            logo_url: string | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[]>;
        categories: import("vue").Ref<{
            created_at: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[], {
            created_at: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[] | {
            created_at: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[]>;
        subcategories: import("vue").Ref<{
            category_id: string;
            created_at: string | null;
            description: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[], {
            category_id: string;
            created_at: string | null;
            description: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[] | {
            category_id: string;
            created_at: string | null;
            description: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[]>;
        colors: import("vue").Ref<{
            created_at: string | null;
            hex_code: string | null;
            id: string;
            name: string;
            slug: string;
        }[], {
            created_at: string | null;
            hex_code: string | null;
            id: string;
            name: string;
            slug: string;
        }[] | {
            created_at: string | null;
            hex_code: string | null;
            id: string;
            name: string;
            slug: string;
        }[]>;
        materials: import("vue").Ref<{
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[], {
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[] | {
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[]>;
        tags: import("vue").Ref<{
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[], {
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[] | {
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[]>;
        productosActivos: ComputedRef<{
            id: string;
            nombre: string;
            descripcion: string | null;
            sku: string;
            slug: string;
            precio: number;
            precio_anterior: number | null;
            precio_metro: number | null;
            stock: number | null;
            unidad: string | null;
            medidas: string | null;
            metros_por_caja: number | null;
            moneda: string | null;
            pei: string | null;
            activo: boolean | null;
            disponible: boolean | null;
            nuevo: boolean | null;
            en_oferta: boolean | null;
            destacado: boolean | null;
            created_at: string | null;
            updated_at: string | null;
            fecha_creacion: string | null;
            fecha_actualizacion: string | null;
            brand_id: string | null;
            color_id: string | null;
            material_id: string | null;
            brand?: {
                created_at: string | null;
                description: string | null;
                id: string;
                is_active: boolean | null;
                logo_url: string | null;
                name: string;
                slug: string;
                updated_at: string | null;
            } | undefined;
            color?: {
                created_at: string | null;
                hex_code: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            material?: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            images: {
                alt_text: string | null;
                created_at: string | null;
                display_order: number | null;
                id: string;
                is_primary: boolean | null;
                product_id: string;
                url: string;
            }[];
            categories: {
                created_at: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            subcategories: {
                category_id: string;
                created_at: string | null;
                description: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            tags: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            }[];
        }[]>;
        productosFormateados: ComputedRef<ProductoAPI[]>;
        productosActivosFormateados: ComputedRef<ProductoAPI[]>;
        cargarProductos: (forzar?: boolean) => Promise<void>;
        cargarReferencias: () => Promise<void>;
        getProductoBySlug: (slug: string) => ProductoCompleto | undefined;
        getProductosByCategoria: (categoria: string) => ProductoCompleto[];
        getProductosBySubcategoria: (subcategoria: string) => ProductoCompleto[];
        getProductosByMarca: (marca: string) => ProductoCompleto[];
        getProductosByTag: (tag: string) => ProductoCompleto[];
        getProductosDestacados: () => ProductoCompleto[];
        getProductosNuevos: () => ProductoCompleto[];
        getProductosEnOferta: () => ProductoCompleto[];
        buscarProductos: (termino: string) => ProductoCompleto[];
        getProductoBySlugFormateado: (slug: string) => ProductoAPI | undefined;
        getProductosByCategoriaFormateado: (categoria: string) => ProductoAPI[];
        transformarProducto: (producto: ProductoCompleto) => ProductoAPI;
    }, "categories" | "subcategories" | "tags" | "brands" | "colors" | "materials" | "productos" | "loading" | "error" | "initialized">, Pick<{
        productos: import("vue").Ref<{
            id: string;
            nombre: string;
            descripcion: string | null;
            sku: string;
            slug: string;
            precio: number;
            precio_anterior: number | null;
            precio_metro: number | null;
            stock: number | null;
            unidad: string | null;
            medidas: string | null;
            metros_por_caja: number | null;
            moneda: string | null;
            pei: string | null;
            activo: boolean | null;
            disponible: boolean | null;
            nuevo: boolean | null;
            en_oferta: boolean | null;
            destacado: boolean | null;
            created_at: string | null;
            updated_at: string | null;
            fecha_creacion: string | null;
            fecha_actualizacion: string | null;
            brand_id: string | null;
            color_id: string | null;
            material_id: string | null;
            brand?: {
                created_at: string | null;
                description: string | null;
                id: string;
                is_active: boolean | null;
                logo_url: string | null;
                name: string;
                slug: string;
                updated_at: string | null;
            } | undefined;
            color?: {
                created_at: string | null;
                hex_code: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            material?: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            images: {
                alt_text: string | null;
                created_at: string | null;
                display_order: number | null;
                id: string;
                is_primary: boolean | null;
                product_id: string;
                url: string;
            }[];
            categories: {
                created_at: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            subcategories: {
                category_id: string;
                created_at: string | null;
                description: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            tags: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            }[];
        }[], ProductoCompleto[] | {
            id: string;
            nombre: string;
            descripcion: string | null;
            sku: string;
            slug: string;
            precio: number;
            precio_anterior: number | null;
            precio_metro: number | null;
            stock: number | null;
            unidad: string | null;
            medidas: string | null;
            metros_por_caja: number | null;
            moneda: string | null;
            pei: string | null;
            activo: boolean | null;
            disponible: boolean | null;
            nuevo: boolean | null;
            en_oferta: boolean | null;
            destacado: boolean | null;
            created_at: string | null;
            updated_at: string | null;
            fecha_creacion: string | null;
            fecha_actualizacion: string | null;
            brand_id: string | null;
            color_id: string | null;
            material_id: string | null;
            brand?: {
                created_at: string | null;
                description: string | null;
                id: string;
                is_active: boolean | null;
                logo_url: string | null;
                name: string;
                slug: string;
                updated_at: string | null;
            } | undefined;
            color?: {
                created_at: string | null;
                hex_code: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            material?: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            images: {
                alt_text: string | null;
                created_at: string | null;
                display_order: number | null;
                id: string;
                is_primary: boolean | null;
                product_id: string;
                url: string;
            }[];
            categories: {
                created_at: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            subcategories: {
                category_id: string;
                created_at: string | null;
                description: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            tags: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            }[];
        }[]>;
        loading: import("vue").Ref<boolean, boolean>;
        error: import("vue").Ref<string | null, string | null>;
        initialized: import("vue").Ref<boolean, boolean>;
        brands: import("vue").Ref<{
            created_at: string | null;
            description: string | null;
            id: string;
            is_active: boolean | null;
            logo_url: string | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[], {
            created_at: string | null;
            description: string | null;
            id: string;
            is_active: boolean | null;
            logo_url: string | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[] | {
            created_at: string | null;
            description: string | null;
            id: string;
            is_active: boolean | null;
            logo_url: string | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[]>;
        categories: import("vue").Ref<{
            created_at: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[], {
            created_at: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[] | {
            created_at: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[]>;
        subcategories: import("vue").Ref<{
            category_id: string;
            created_at: string | null;
            description: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[], {
            category_id: string;
            created_at: string | null;
            description: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[] | {
            category_id: string;
            created_at: string | null;
            description: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[]>;
        colors: import("vue").Ref<{
            created_at: string | null;
            hex_code: string | null;
            id: string;
            name: string;
            slug: string;
        }[], {
            created_at: string | null;
            hex_code: string | null;
            id: string;
            name: string;
            slug: string;
        }[] | {
            created_at: string | null;
            hex_code: string | null;
            id: string;
            name: string;
            slug: string;
        }[]>;
        materials: import("vue").Ref<{
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[], {
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[] | {
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[]>;
        tags: import("vue").Ref<{
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[], {
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[] | {
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[]>;
        productosActivos: ComputedRef<{
            id: string;
            nombre: string;
            descripcion: string | null;
            sku: string;
            slug: string;
            precio: number;
            precio_anterior: number | null;
            precio_metro: number | null;
            stock: number | null;
            unidad: string | null;
            medidas: string | null;
            metros_por_caja: number | null;
            moneda: string | null;
            pei: string | null;
            activo: boolean | null;
            disponible: boolean | null;
            nuevo: boolean | null;
            en_oferta: boolean | null;
            destacado: boolean | null;
            created_at: string | null;
            updated_at: string | null;
            fecha_creacion: string | null;
            fecha_actualizacion: string | null;
            brand_id: string | null;
            color_id: string | null;
            material_id: string | null;
            brand?: {
                created_at: string | null;
                description: string | null;
                id: string;
                is_active: boolean | null;
                logo_url: string | null;
                name: string;
                slug: string;
                updated_at: string | null;
            } | undefined;
            color?: {
                created_at: string | null;
                hex_code: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            material?: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            images: {
                alt_text: string | null;
                created_at: string | null;
                display_order: number | null;
                id: string;
                is_primary: boolean | null;
                product_id: string;
                url: string;
            }[];
            categories: {
                created_at: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            subcategories: {
                category_id: string;
                created_at: string | null;
                description: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            tags: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            }[];
        }[]>;
        productosFormateados: ComputedRef<ProductoAPI[]>;
        productosActivosFormateados: ComputedRef<ProductoAPI[]>;
        cargarProductos: (forzar?: boolean) => Promise<void>;
        cargarReferencias: () => Promise<void>;
        getProductoBySlug: (slug: string) => ProductoCompleto | undefined;
        getProductosByCategoria: (categoria: string) => ProductoCompleto[];
        getProductosBySubcategoria: (subcategoria: string) => ProductoCompleto[];
        getProductosByMarca: (marca: string) => ProductoCompleto[];
        getProductosByTag: (tag: string) => ProductoCompleto[];
        getProductosDestacados: () => ProductoCompleto[];
        getProductosNuevos: () => ProductoCompleto[];
        getProductosEnOferta: () => ProductoCompleto[];
        buscarProductos: (termino: string) => ProductoCompleto[];
        getProductoBySlugFormateado: (slug: string) => ProductoAPI | undefined;
        getProductosByCategoriaFormateado: (categoria: string) => ProductoAPI[];
        transformarProducto: (producto: ProductoCompleto) => ProductoAPI;
    }, "productosActivos" | "productosFormateados" | "productosActivosFormateados">, Pick<{
        productos: import("vue").Ref<{
            id: string;
            nombre: string;
            descripcion: string | null;
            sku: string;
            slug: string;
            precio: number;
            precio_anterior: number | null;
            precio_metro: number | null;
            stock: number | null;
            unidad: string | null;
            medidas: string | null;
            metros_por_caja: number | null;
            moneda: string | null;
            pei: string | null;
            activo: boolean | null;
            disponible: boolean | null;
            nuevo: boolean | null;
            en_oferta: boolean | null;
            destacado: boolean | null;
            created_at: string | null;
            updated_at: string | null;
            fecha_creacion: string | null;
            fecha_actualizacion: string | null;
            brand_id: string | null;
            color_id: string | null;
            material_id: string | null;
            brand?: {
                created_at: string | null;
                description: string | null;
                id: string;
                is_active: boolean | null;
                logo_url: string | null;
                name: string;
                slug: string;
                updated_at: string | null;
            } | undefined;
            color?: {
                created_at: string | null;
                hex_code: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            material?: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            images: {
                alt_text: string | null;
                created_at: string | null;
                display_order: number | null;
                id: string;
                is_primary: boolean | null;
                product_id: string;
                url: string;
            }[];
            categories: {
                created_at: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            subcategories: {
                category_id: string;
                created_at: string | null;
                description: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            tags: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            }[];
        }[], ProductoCompleto[] | {
            id: string;
            nombre: string;
            descripcion: string | null;
            sku: string;
            slug: string;
            precio: number;
            precio_anterior: number | null;
            precio_metro: number | null;
            stock: number | null;
            unidad: string | null;
            medidas: string | null;
            metros_por_caja: number | null;
            moneda: string | null;
            pei: string | null;
            activo: boolean | null;
            disponible: boolean | null;
            nuevo: boolean | null;
            en_oferta: boolean | null;
            destacado: boolean | null;
            created_at: string | null;
            updated_at: string | null;
            fecha_creacion: string | null;
            fecha_actualizacion: string | null;
            brand_id: string | null;
            color_id: string | null;
            material_id: string | null;
            brand?: {
                created_at: string | null;
                description: string | null;
                id: string;
                is_active: boolean | null;
                logo_url: string | null;
                name: string;
                slug: string;
                updated_at: string | null;
            } | undefined;
            color?: {
                created_at: string | null;
                hex_code: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            material?: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            images: {
                alt_text: string | null;
                created_at: string | null;
                display_order: number | null;
                id: string;
                is_primary: boolean | null;
                product_id: string;
                url: string;
            }[];
            categories: {
                created_at: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            subcategories: {
                category_id: string;
                created_at: string | null;
                description: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            tags: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            }[];
        }[]>;
        loading: import("vue").Ref<boolean, boolean>;
        error: import("vue").Ref<string | null, string | null>;
        initialized: import("vue").Ref<boolean, boolean>;
        brands: import("vue").Ref<{
            created_at: string | null;
            description: string | null;
            id: string;
            is_active: boolean | null;
            logo_url: string | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[], {
            created_at: string | null;
            description: string | null;
            id: string;
            is_active: boolean | null;
            logo_url: string | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[] | {
            created_at: string | null;
            description: string | null;
            id: string;
            is_active: boolean | null;
            logo_url: string | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[]>;
        categories: import("vue").Ref<{
            created_at: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[], {
            created_at: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[] | {
            created_at: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[]>;
        subcategories: import("vue").Ref<{
            category_id: string;
            created_at: string | null;
            description: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[], {
            category_id: string;
            created_at: string | null;
            description: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[] | {
            category_id: string;
            created_at: string | null;
            description: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[]>;
        colors: import("vue").Ref<{
            created_at: string | null;
            hex_code: string | null;
            id: string;
            name: string;
            slug: string;
        }[], {
            created_at: string | null;
            hex_code: string | null;
            id: string;
            name: string;
            slug: string;
        }[] | {
            created_at: string | null;
            hex_code: string | null;
            id: string;
            name: string;
            slug: string;
        }[]>;
        materials: import("vue").Ref<{
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[], {
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[] | {
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[]>;
        tags: import("vue").Ref<{
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[], {
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[] | {
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[]>;
        productosActivos: ComputedRef<{
            id: string;
            nombre: string;
            descripcion: string | null;
            sku: string;
            slug: string;
            precio: number;
            precio_anterior: number | null;
            precio_metro: number | null;
            stock: number | null;
            unidad: string | null;
            medidas: string | null;
            metros_por_caja: number | null;
            moneda: string | null;
            pei: string | null;
            activo: boolean | null;
            disponible: boolean | null;
            nuevo: boolean | null;
            en_oferta: boolean | null;
            destacado: boolean | null;
            created_at: string | null;
            updated_at: string | null;
            fecha_creacion: string | null;
            fecha_actualizacion: string | null;
            brand_id: string | null;
            color_id: string | null;
            material_id: string | null;
            brand?: {
                created_at: string | null;
                description: string | null;
                id: string;
                is_active: boolean | null;
                logo_url: string | null;
                name: string;
                slug: string;
                updated_at: string | null;
            } | undefined;
            color?: {
                created_at: string | null;
                hex_code: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            material?: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            } | undefined;
            images: {
                alt_text: string | null;
                created_at: string | null;
                display_order: number | null;
                id: string;
                is_primary: boolean | null;
                product_id: string;
                url: string;
            }[];
            categories: {
                created_at: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            subcategories: {
                category_id: string;
                created_at: string | null;
                description: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            }[];
            tags: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            }[];
        }[]>;
        productosFormateados: ComputedRef<ProductoAPI[]>;
        productosActivosFormateados: ComputedRef<ProductoAPI[]>;
        cargarProductos: (forzar?: boolean) => Promise<void>;
        cargarReferencias: () => Promise<void>;
        getProductoBySlug: (slug: string) => ProductoCompleto | undefined;
        getProductosByCategoria: (categoria: string) => ProductoCompleto[];
        getProductosBySubcategoria: (subcategoria: string) => ProductoCompleto[];
        getProductosByMarca: (marca: string) => ProductoCompleto[];
        getProductosByTag: (tag: string) => ProductoCompleto[];
        getProductosDestacados: () => ProductoCompleto[];
        getProductosNuevos: () => ProductoCompleto[];
        getProductosEnOferta: () => ProductoCompleto[];
        buscarProductos: (termino: string) => ProductoCompleto[];
        getProductoBySlugFormateado: (slug: string) => ProductoAPI | undefined;
        getProductosByCategoriaFormateado: (categoria: string) => ProductoAPI[];
        transformarProducto: (producto: ProductoCompleto) => ProductoAPI;
    }, "cargarProductos" | "cargarReferencias" | "getProductoBySlug" | "getProductosByCategoria" | "getProductosBySubcategoria" | "getProductosByMarca" | "getProductosByTag" | "getProductosDestacados" | "getProductosNuevos" | "getProductosEnOferta" | "buscarProductos" | "getProductoBySlugFormateado" | "getProductosByCategoriaFormateado" | "transformarProducto">>;
    productos: ComputedRef<{
        id: string;
        nombre: string;
        descripcion: string | null;
        sku: string;
        slug: string;
        precio: number;
        precio_anterior: number | null;
        precio_metro: number | null;
        stock: number | null;
        unidad: string | null;
        medidas: string | null;
        metros_por_caja: number | null;
        moneda: string | null;
        pei: string | null;
        activo: boolean | null;
        disponible: boolean | null;
        nuevo: boolean | null;
        en_oferta: boolean | null;
        destacado: boolean | null;
        created_at: string | null;
        updated_at: string | null;
        fecha_creacion: string | null;
        fecha_actualizacion: string | null;
        brand_id: string | null;
        color_id: string | null;
        material_id: string | null;
        brand?: {
            created_at: string | null;
            description: string | null;
            id: string;
            is_active: boolean | null;
            logo_url: string | null;
            name: string;
            slug: string;
            updated_at: string | null;
        } | undefined;
        color?: {
            created_at: string | null;
            hex_code: string | null;
            id: string;
            name: string;
            slug: string;
        } | undefined;
        material?: {
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        } | undefined;
        images: {
            alt_text: string | null;
            created_at: string | null;
            display_order: number | null;
            id: string;
            is_primary: boolean | null;
            product_id: string;
            url: string;
        }[];
        categories: {
            created_at: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[];
        subcategories: {
            category_id: string;
            created_at: string | null;
            description: string | null;
            display_order: number | null;
            id: string;
            image_url: string | null;
            is_active: boolean | null;
            name: string;
            slug: string;
            updated_at: string | null;
        }[];
        tags: {
            created_at: string | null;
            id: string;
            name: string;
            slug: string;
        }[];
    }[]>;
    loading: ComputedRef<boolean>;
    error: ComputedRef<string | null>;
    cargarSiEsNecesario: () => Promise<void>;
    cargar: (forzar?: boolean) => Promise<void>;
};
/**
 * Composable para un producto individual
 */
export declare function useProducto(slug: ComputedRef<string> | string): {
    producto: ComputedRef<ProductoCompleto | undefined>;
    productoFormateado: ComputedRef<ProductoAPI | undefined>;
    loading: ComputedRef<boolean>;
    error: ComputedRef<string | null>;
    cargarSiEsNecesario: () => Promise<void>;
};
/**
 * Composable para productos por categoría
 */
export declare function useCategoria(categoria: ComputedRef<string> | string): {
    productos: ComputedRef<ProductoCompleto[]>;
    categoriaInfo: ComputedRef<{
        created_at: string | null;
        display_order: number | null;
        id: string;
        image_url: string | null;
        is_active: boolean | null;
        name: string;
        slug: string;
        updated_at: string | null;
    } | undefined>;
    loading: ComputedRef<boolean>;
    error: ComputedRef<string | null>;
};
/**
 * Utilidad para formatear precios
 */
export declare function formatearPrecio(precio: number, moneda?: string): string;
/**
 * Utilidad para calcular descuento
 */
export declare function calcularDescuento(precioActual: number, precioAnterior: number | null): number;
/**
 * Utilidad para obtener la URL de la imagen principal
 */
export declare function obtenerImagenPrincipal(producto: ProductoCompleto | ProductoAPI): string;
/**
 * Utilidad para filtrar productos por rango de precio
 */
export declare function filtrarPorPrecio(productos: ProductoCompleto[], precioMin?: number, precioMax?: number): ProductoCompleto[];
/**
 * Utilidad para ordenar productos
 */
export type OrdenProductos = 'precio-asc' | 'precio-desc' | 'nombre-asc' | 'nombre-desc' | 'nuevo' | 'destacado';
export declare function ordenarProductos(productos: ProductoCompleto[], orden: OrdenProductos): ProductoCompleto[];
/**
 * Utilidad para agrupar productos por categoría
 */
export declare function agruparPorCategoria(productos: ProductoCompleto[]): Map<string, ProductoCompleto[]>;
/**
 * Utilidad para agrupar productos por marca
 */
export declare function agruparPorMarca(productos: ProductoCompleto[]): Map<string, ProductoCompleto[]>;
/**
 * Utilidad para obtener productos relacionados
 * (mismo material, misma categoría o mismo color)
 */
export declare function obtenerProductosRelacionados(producto: ProductoCompleto, todosLosProductos: ProductoCompleto[], limite?: number): ProductoCompleto[];
/**
 * Utilidad para generar breadcrumbs
 */
export interface Breadcrumb {
    label: string;
    url: string;
}
/**
 * Utilidad para validar disponibilidad de stock
 */
export declare function verificarDisponibilidad(producto: ProductoCompleto, cantidadSolicitada?: number): {
    disponible: boolean;
    mensaje: string;
};
/**
 * Utilidad para obtener el texto SEO de un producto
 */
export declare function generarMetaSEO(producto: ProductoCompleto): {
    title: string;
    description: string;
    keywords: string[];
};
