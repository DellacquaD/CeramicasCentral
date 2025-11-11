import type { Database } from '@/types/database.types';
type BrandInsert = Database['public']['Tables']['brands']['Insert'];
type BrandUpdate = Database['public']['Tables']['brands']['Update'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];
type SubcategoryInsert = Database['public']['Tables']['subcategories']['Insert'];
type SubcategoryUpdate = Database['public']['Tables']['subcategories']['Update'];
type ColorInsert = Database['public']['Tables']['colors']['Insert'];
type ColorUpdate = Database['public']['Tables']['colors']['Update'];
type MaterialInsert = Database['public']['Tables']['materials']['Insert'];
type MaterialUpdate = Database['public']['Tables']['materials']['Update'];
type TagInsert = Database['public']['Tables']['tags']['Insert'];
type TagUpdate = Database['public']['Tables']['tags']['Update'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];
export declare const useAdminStore: import("pinia").StoreDefinition<"admin", Pick<{
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    getBrands: () => Promise<{
        created_at: string | null;
        description: string | null;
        id: string;
        is_active: boolean | null;
        logo_url: string | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }[]>;
    createBrand: (brand: BrandInsert) => Promise<{
        created_at: string | null;
        description: string | null;
        id: string;
        is_active: boolean | null;
        logo_url: string | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }>;
    updateBrand: (id: string, brand: BrandUpdate) => Promise<{
        created_at: string | null;
        description: string | null;
        id: string;
        is_active: boolean | null;
        logo_url: string | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }>;
    deleteBrand: (id: string) => Promise<void>;
    getCategories: () => Promise<{
        created_at: string | null;
        display_order: number | null;
        id: string;
        image_url: string | null;
        is_active: boolean | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }[]>;
    createCategory: (category: CategoryInsert) => Promise<{
        created_at: string | null;
        display_order: number | null;
        id: string;
        image_url: string | null;
        is_active: boolean | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }>;
    updateCategory: (id: string, category: CategoryUpdate) => Promise<{
        created_at: string | null;
        display_order: number | null;
        id: string;
        image_url: string | null;
        is_active: boolean | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }>;
    deleteCategory: (id: string) => Promise<void>;
    getSubcategories: () => Promise<{
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
        category: {
            id: string;
            name: string;
        };
    }[]>;
    createSubcategory: (subcategory: SubcategoryInsert) => Promise<{
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
    }>;
    updateSubcategory: (id: string, subcategory: SubcategoryUpdate) => Promise<{
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
    }>;
    deleteSubcategory: (id: string) => Promise<void>;
    getColors: () => Promise<{
        created_at: string | null;
        hex_code: string | null;
        id: string;
        name: string;
        slug: string;
    }[]>;
    createColor: (color: ColorInsert) => Promise<{
        created_at: string | null;
        hex_code: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    updateColor: (id: string, color: ColorUpdate) => Promise<{
        created_at: string | null;
        hex_code: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    deleteColor: (id: string) => Promise<void>;
    getMaterials: () => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }[]>;
    createMaterial: (material: MaterialInsert) => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    updateMaterial: (id: string, material: MaterialUpdate) => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    deleteMaterial: (id: string) => Promise<void>;
    getTags: () => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }[]>;
    createTag: (tag: TagInsert) => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    updateTag: (id: string, tag: TagUpdate) => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    deleteTag: (id: string) => Promise<void>;
    getProducts: () => Promise<{
        activo: boolean | null;
        brand_id: string | null;
        color_id: string | null;
        created_at: string | null;
        descripcion: string | null;
        destacado: boolean | null;
        disponible: boolean | null;
        en_oferta: boolean | null;
        fecha_actualizacion: string | null;
        fecha_creacion: string | null;
        id: string;
        material_id: string | null;
        medidas: string | null;
        metros_por_caja: number | null;
        moneda: string | null;
        nombre: string;
        nuevo: boolean | null;
        pei: string | null;
        precio: number;
        precio_anterior: number | null;
        precio_metro: number | null;
        sku: string;
        slug: string;
        stock: number | null;
        unidad: string | null;
        updated_at: string | null;
        brand: {
            id: string;
            name: string;
        } | null;
        color: {
            id: string;
            name: string;
        } | null;
        material: {
            id: string;
            name: string;
        } | null;
        images: {
            alt_text: string | null;
            created_at: string | null;
            display_order: number | null;
            id: string;
            is_primary: boolean | null;
            product_id: string;
            url: string;
        }[];
        product_categories: {
            category: {
                id: string;
                name: string;
            };
        }[];
        product_subcategories: {
            subcategory: {
                id: string;
                name: string;
            };
        }[];
        product_tags: {
            tag: {
                id: string;
                name: string;
            };
        }[];
    }[]>;
    createProduct: (product: ProductInsert) => Promise<{
        activo: boolean | null;
        brand_id: string | null;
        color_id: string | null;
        created_at: string | null;
        descripcion: string | null;
        destacado: boolean | null;
        disponible: boolean | null;
        en_oferta: boolean | null;
        fecha_actualizacion: string | null;
        fecha_creacion: string | null;
        id: string;
        material_id: string | null;
        medidas: string | null;
        metros_por_caja: number | null;
        moneda: string | null;
        nombre: string;
        nuevo: boolean | null;
        pei: string | null;
        precio: number;
        precio_anterior: number | null;
        precio_metro: number | null;
        sku: string;
        slug: string;
        stock: number | null;
        unidad: string | null;
        updated_at: string | null;
    }>;
    updateProduct: (id: string, product: ProductUpdate) => Promise<{
        activo: boolean | null;
        brand_id: string | null;
        color_id: string | null;
        created_at: string | null;
        descripcion: string | null;
        destacado: boolean | null;
        disponible: boolean | null;
        en_oferta: boolean | null;
        fecha_actualizacion: string | null;
        fecha_creacion: string | null;
        id: string;
        material_id: string | null;
        medidas: string | null;
        metros_por_caja: number | null;
        moneda: string | null;
        nombre: string;
        nuevo: boolean | null;
        pei: string | null;
        precio: number;
        precio_anterior: number | null;
        precio_metro: number | null;
        sku: string;
        slug: string;
        stock: number | null;
        unidad: string | null;
        updated_at: string | null;
    }>;
    deleteProduct: (id: string) => Promise<void>;
    addProductCategory: (productId: string, categoryId: string) => Promise<void>;
    removeProductCategory: (productId: string, categoryId: string) => Promise<void>;
    addProductSubcategory: (productId: string, subcategoryId: string, isPrimary?: boolean) => Promise<void>;
    removeProductSubcategory: (productId: string, subcategoryId: string) => Promise<void>;
    addProductTag: (productId: string, tagId: string) => Promise<void>;
    removeProductTag: (productId: string, tagId: string) => Promise<void>;
    addProductImage: (productId: string, url: string, altText?: string, isPrimary?: boolean, displayOrder?: number) => Promise<{
        alt_text: string | null;
        created_at: string | null;
        display_order: number | null;
        id: string;
        is_primary: boolean | null;
        product_id: string;
        url: string;
    }>;
    updateProductImage: (imageId: string, updates: {
        url?: string;
        alt_text?: string;
        is_primary?: boolean;
        display_order?: number;
    }) => Promise<{
        alt_text: string | null;
        created_at: string | null;
        display_order: number | null;
        id: string;
        is_primary: boolean | null;
        product_id: string;
        url: string;
    }>;
    deleteProductImage: (imageId: string) => Promise<void>;
}, "loading" | "error">, Pick<{
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    getBrands: () => Promise<{
        created_at: string | null;
        description: string | null;
        id: string;
        is_active: boolean | null;
        logo_url: string | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }[]>;
    createBrand: (brand: BrandInsert) => Promise<{
        created_at: string | null;
        description: string | null;
        id: string;
        is_active: boolean | null;
        logo_url: string | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }>;
    updateBrand: (id: string, brand: BrandUpdate) => Promise<{
        created_at: string | null;
        description: string | null;
        id: string;
        is_active: boolean | null;
        logo_url: string | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }>;
    deleteBrand: (id: string) => Promise<void>;
    getCategories: () => Promise<{
        created_at: string | null;
        display_order: number | null;
        id: string;
        image_url: string | null;
        is_active: boolean | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }[]>;
    createCategory: (category: CategoryInsert) => Promise<{
        created_at: string | null;
        display_order: number | null;
        id: string;
        image_url: string | null;
        is_active: boolean | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }>;
    updateCategory: (id: string, category: CategoryUpdate) => Promise<{
        created_at: string | null;
        display_order: number | null;
        id: string;
        image_url: string | null;
        is_active: boolean | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }>;
    deleteCategory: (id: string) => Promise<void>;
    getSubcategories: () => Promise<{
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
        category: {
            id: string;
            name: string;
        };
    }[]>;
    createSubcategory: (subcategory: SubcategoryInsert) => Promise<{
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
    }>;
    updateSubcategory: (id: string, subcategory: SubcategoryUpdate) => Promise<{
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
    }>;
    deleteSubcategory: (id: string) => Promise<void>;
    getColors: () => Promise<{
        created_at: string | null;
        hex_code: string | null;
        id: string;
        name: string;
        slug: string;
    }[]>;
    createColor: (color: ColorInsert) => Promise<{
        created_at: string | null;
        hex_code: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    updateColor: (id: string, color: ColorUpdate) => Promise<{
        created_at: string | null;
        hex_code: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    deleteColor: (id: string) => Promise<void>;
    getMaterials: () => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }[]>;
    createMaterial: (material: MaterialInsert) => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    updateMaterial: (id: string, material: MaterialUpdate) => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    deleteMaterial: (id: string) => Promise<void>;
    getTags: () => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }[]>;
    createTag: (tag: TagInsert) => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    updateTag: (id: string, tag: TagUpdate) => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    deleteTag: (id: string) => Promise<void>;
    getProducts: () => Promise<{
        activo: boolean | null;
        brand_id: string | null;
        color_id: string | null;
        created_at: string | null;
        descripcion: string | null;
        destacado: boolean | null;
        disponible: boolean | null;
        en_oferta: boolean | null;
        fecha_actualizacion: string | null;
        fecha_creacion: string | null;
        id: string;
        material_id: string | null;
        medidas: string | null;
        metros_por_caja: number | null;
        moneda: string | null;
        nombre: string;
        nuevo: boolean | null;
        pei: string | null;
        precio: number;
        precio_anterior: number | null;
        precio_metro: number | null;
        sku: string;
        slug: string;
        stock: number | null;
        unidad: string | null;
        updated_at: string | null;
        brand: {
            id: string;
            name: string;
        } | null;
        color: {
            id: string;
            name: string;
        } | null;
        material: {
            id: string;
            name: string;
        } | null;
        images: {
            alt_text: string | null;
            created_at: string | null;
            display_order: number | null;
            id: string;
            is_primary: boolean | null;
            product_id: string;
            url: string;
        }[];
        product_categories: {
            category: {
                id: string;
                name: string;
            };
        }[];
        product_subcategories: {
            subcategory: {
                id: string;
                name: string;
            };
        }[];
        product_tags: {
            tag: {
                id: string;
                name: string;
            };
        }[];
    }[]>;
    createProduct: (product: ProductInsert) => Promise<{
        activo: boolean | null;
        brand_id: string | null;
        color_id: string | null;
        created_at: string | null;
        descripcion: string | null;
        destacado: boolean | null;
        disponible: boolean | null;
        en_oferta: boolean | null;
        fecha_actualizacion: string | null;
        fecha_creacion: string | null;
        id: string;
        material_id: string | null;
        medidas: string | null;
        metros_por_caja: number | null;
        moneda: string | null;
        nombre: string;
        nuevo: boolean | null;
        pei: string | null;
        precio: number;
        precio_anterior: number | null;
        precio_metro: number | null;
        sku: string;
        slug: string;
        stock: number | null;
        unidad: string | null;
        updated_at: string | null;
    }>;
    updateProduct: (id: string, product: ProductUpdate) => Promise<{
        activo: boolean | null;
        brand_id: string | null;
        color_id: string | null;
        created_at: string | null;
        descripcion: string | null;
        destacado: boolean | null;
        disponible: boolean | null;
        en_oferta: boolean | null;
        fecha_actualizacion: string | null;
        fecha_creacion: string | null;
        id: string;
        material_id: string | null;
        medidas: string | null;
        metros_por_caja: number | null;
        moneda: string | null;
        nombre: string;
        nuevo: boolean | null;
        pei: string | null;
        precio: number;
        precio_anterior: number | null;
        precio_metro: number | null;
        sku: string;
        slug: string;
        stock: number | null;
        unidad: string | null;
        updated_at: string | null;
    }>;
    deleteProduct: (id: string) => Promise<void>;
    addProductCategory: (productId: string, categoryId: string) => Promise<void>;
    removeProductCategory: (productId: string, categoryId: string) => Promise<void>;
    addProductSubcategory: (productId: string, subcategoryId: string, isPrimary?: boolean) => Promise<void>;
    removeProductSubcategory: (productId: string, subcategoryId: string) => Promise<void>;
    addProductTag: (productId: string, tagId: string) => Promise<void>;
    removeProductTag: (productId: string, tagId: string) => Promise<void>;
    addProductImage: (productId: string, url: string, altText?: string, isPrimary?: boolean, displayOrder?: number) => Promise<{
        alt_text: string | null;
        created_at: string | null;
        display_order: number | null;
        id: string;
        is_primary: boolean | null;
        product_id: string;
        url: string;
    }>;
    updateProductImage: (imageId: string, updates: {
        url?: string;
        alt_text?: string;
        is_primary?: boolean;
        display_order?: number;
    }) => Promise<{
        alt_text: string | null;
        created_at: string | null;
        display_order: number | null;
        id: string;
        is_primary: boolean | null;
        product_id: string;
        url: string;
    }>;
    deleteProductImage: (imageId: string) => Promise<void>;
}, never>, Pick<{
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    getBrands: () => Promise<{
        created_at: string | null;
        description: string | null;
        id: string;
        is_active: boolean | null;
        logo_url: string | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }[]>;
    createBrand: (brand: BrandInsert) => Promise<{
        created_at: string | null;
        description: string | null;
        id: string;
        is_active: boolean | null;
        logo_url: string | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }>;
    updateBrand: (id: string, brand: BrandUpdate) => Promise<{
        created_at: string | null;
        description: string | null;
        id: string;
        is_active: boolean | null;
        logo_url: string | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }>;
    deleteBrand: (id: string) => Promise<void>;
    getCategories: () => Promise<{
        created_at: string | null;
        display_order: number | null;
        id: string;
        image_url: string | null;
        is_active: boolean | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }[]>;
    createCategory: (category: CategoryInsert) => Promise<{
        created_at: string | null;
        display_order: number | null;
        id: string;
        image_url: string | null;
        is_active: boolean | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }>;
    updateCategory: (id: string, category: CategoryUpdate) => Promise<{
        created_at: string | null;
        display_order: number | null;
        id: string;
        image_url: string | null;
        is_active: boolean | null;
        name: string;
        slug: string;
        updated_at: string | null;
    }>;
    deleteCategory: (id: string) => Promise<void>;
    getSubcategories: () => Promise<{
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
        category: {
            id: string;
            name: string;
        };
    }[]>;
    createSubcategory: (subcategory: SubcategoryInsert) => Promise<{
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
    }>;
    updateSubcategory: (id: string, subcategory: SubcategoryUpdate) => Promise<{
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
    }>;
    deleteSubcategory: (id: string) => Promise<void>;
    getColors: () => Promise<{
        created_at: string | null;
        hex_code: string | null;
        id: string;
        name: string;
        slug: string;
    }[]>;
    createColor: (color: ColorInsert) => Promise<{
        created_at: string | null;
        hex_code: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    updateColor: (id: string, color: ColorUpdate) => Promise<{
        created_at: string | null;
        hex_code: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    deleteColor: (id: string) => Promise<void>;
    getMaterials: () => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }[]>;
    createMaterial: (material: MaterialInsert) => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    updateMaterial: (id: string, material: MaterialUpdate) => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    deleteMaterial: (id: string) => Promise<void>;
    getTags: () => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }[]>;
    createTag: (tag: TagInsert) => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    updateTag: (id: string, tag: TagUpdate) => Promise<{
        created_at: string | null;
        id: string;
        name: string;
        slug: string;
    }>;
    deleteTag: (id: string) => Promise<void>;
    getProducts: () => Promise<{
        activo: boolean | null;
        brand_id: string | null;
        color_id: string | null;
        created_at: string | null;
        descripcion: string | null;
        destacado: boolean | null;
        disponible: boolean | null;
        en_oferta: boolean | null;
        fecha_actualizacion: string | null;
        fecha_creacion: string | null;
        id: string;
        material_id: string | null;
        medidas: string | null;
        metros_por_caja: number | null;
        moneda: string | null;
        nombre: string;
        nuevo: boolean | null;
        pei: string | null;
        precio: number;
        precio_anterior: number | null;
        precio_metro: number | null;
        sku: string;
        slug: string;
        stock: number | null;
        unidad: string | null;
        updated_at: string | null;
        brand: {
            id: string;
            name: string;
        } | null;
        color: {
            id: string;
            name: string;
        } | null;
        material: {
            id: string;
            name: string;
        } | null;
        images: {
            alt_text: string | null;
            created_at: string | null;
            display_order: number | null;
            id: string;
            is_primary: boolean | null;
            product_id: string;
            url: string;
        }[];
        product_categories: {
            category: {
                id: string;
                name: string;
            };
        }[];
        product_subcategories: {
            subcategory: {
                id: string;
                name: string;
            };
        }[];
        product_tags: {
            tag: {
                id: string;
                name: string;
            };
        }[];
    }[]>;
    createProduct: (product: ProductInsert) => Promise<{
        activo: boolean | null;
        brand_id: string | null;
        color_id: string | null;
        created_at: string | null;
        descripcion: string | null;
        destacado: boolean | null;
        disponible: boolean | null;
        en_oferta: boolean | null;
        fecha_actualizacion: string | null;
        fecha_creacion: string | null;
        id: string;
        material_id: string | null;
        medidas: string | null;
        metros_por_caja: number | null;
        moneda: string | null;
        nombre: string;
        nuevo: boolean | null;
        pei: string | null;
        precio: number;
        precio_anterior: number | null;
        precio_metro: number | null;
        sku: string;
        slug: string;
        stock: number | null;
        unidad: string | null;
        updated_at: string | null;
    }>;
    updateProduct: (id: string, product: ProductUpdate) => Promise<{
        activo: boolean | null;
        brand_id: string | null;
        color_id: string | null;
        created_at: string | null;
        descripcion: string | null;
        destacado: boolean | null;
        disponible: boolean | null;
        en_oferta: boolean | null;
        fecha_actualizacion: string | null;
        fecha_creacion: string | null;
        id: string;
        material_id: string | null;
        medidas: string | null;
        metros_por_caja: number | null;
        moneda: string | null;
        nombre: string;
        nuevo: boolean | null;
        pei: string | null;
        precio: number;
        precio_anterior: number | null;
        precio_metro: number | null;
        sku: string;
        slug: string;
        stock: number | null;
        unidad: string | null;
        updated_at: string | null;
    }>;
    deleteProduct: (id: string) => Promise<void>;
    addProductCategory: (productId: string, categoryId: string) => Promise<void>;
    removeProductCategory: (productId: string, categoryId: string) => Promise<void>;
    addProductSubcategory: (productId: string, subcategoryId: string, isPrimary?: boolean) => Promise<void>;
    removeProductSubcategory: (productId: string, subcategoryId: string) => Promise<void>;
    addProductTag: (productId: string, tagId: string) => Promise<void>;
    removeProductTag: (productId: string, tagId: string) => Promise<void>;
    addProductImage: (productId: string, url: string, altText?: string, isPrimary?: boolean, displayOrder?: number) => Promise<{
        alt_text: string | null;
        created_at: string | null;
        display_order: number | null;
        id: string;
        is_primary: boolean | null;
        product_id: string;
        url: string;
    }>;
    updateProductImage: (imageId: string, updates: {
        url?: string;
        alt_text?: string;
        is_primary?: boolean;
        display_order?: number;
    }) => Promise<{
        alt_text: string | null;
        created_at: string | null;
        display_order: number | null;
        id: string;
        is_primary: boolean | null;
        product_id: string;
        url: string;
    }>;
    deleteProductImage: (imageId: string) => Promise<void>;
}, "getBrands" | "createBrand" | "updateBrand" | "deleteBrand" | "getCategories" | "createCategory" | "updateCategory" | "deleteCategory" | "getSubcategories" | "createSubcategory" | "updateSubcategory" | "deleteSubcategory" | "getColors" | "createColor" | "updateColor" | "deleteColor" | "getMaterials" | "createMaterial" | "updateMaterial" | "deleteMaterial" | "getTags" | "createTag" | "updateTag" | "deleteTag" | "getProducts" | "createProduct" | "updateProduct" | "deleteProduct" | "addProductCategory" | "removeProductCategory" | "addProductSubcategory" | "removeProductSubcategory" | "addProductTag" | "removeProductTag" | "addProductImage" | "updateProductImage" | "deleteProductImage">>;
export {};
