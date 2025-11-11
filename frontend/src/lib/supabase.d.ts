import type { Database } from "@/types/database.types.ts";
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", {
    Tables: {
        brands: {
            Row: {
                created_at: string | null;
                description: string | null;
                id: string;
                is_active: boolean | null;
                logo_url: string | null;
                name: string;
                slug: string;
                updated_at: string | null;
            };
            Insert: {
                created_at?: string | null;
                description?: string | null;
                id?: string;
                is_active?: boolean | null;
                logo_url?: string | null;
                name: string;
                slug: string;
                updated_at?: string | null;
            };
            Update: {
                created_at?: string | null;
                description?: string | null;
                id?: string;
                is_active?: boolean | null;
                logo_url?: string | null;
                name?: string;
                slug?: string;
                updated_at?: string | null;
            };
            Relationships: [];
        };
        categories: {
            Row: {
                created_at: string | null;
                display_order: number | null;
                id: string;
                image_url: string | null;
                is_active: boolean | null;
                name: string;
                slug: string;
                updated_at: string | null;
            };
            Insert: {
                created_at?: string | null;
                display_order?: number | null;
                id?: string;
                image_url?: string | null;
                is_active?: boolean | null;
                name: string;
                slug: string;
                updated_at?: string | null;
            };
            Update: {
                created_at?: string | null;
                display_order?: number | null;
                id?: string;
                image_url?: string | null;
                is_active?: boolean | null;
                name?: string;
                slug?: string;
                updated_at?: string | null;
            };
            Relationships: [];
        };
        colors: {
            Row: {
                created_at: string | null;
                hex_code: string | null;
                id: string;
                name: string;
                slug: string;
            };
            Insert: {
                created_at?: string | null;
                hex_code?: string | null;
                id?: string;
                name: string;
                slug: string;
            };
            Update: {
                created_at?: string | null;
                hex_code?: string | null;
                id?: string;
                name?: string;
                slug?: string;
            };
            Relationships: [];
        };
        materials: {
            Row: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            };
            Insert: {
                created_at?: string | null;
                id?: string;
                name: string;
                slug: string;
            };
            Update: {
                created_at?: string | null;
                id?: string;
                name?: string;
                slug?: string;
            };
            Relationships: [];
        };
        product_categories: {
            Row: {
                category_id: string;
                created_at: string | null;
                id: string;
                product_id: string;
            };
            Insert: {
                category_id: string;
                created_at?: string | null;
                id?: string;
                product_id: string;
            };
            Update: {
                category_id?: string;
                created_at?: string | null;
                id?: string;
                product_id?: string;
            };
            Relationships: [{
                foreignKeyName: "product_categories_category_id_fkey";
                columns: ["category_id"];
                isOneToOne: false;
                referencedRelation: "categories";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "product_categories_product_id_fkey";
                columns: ["product_id"];
                isOneToOne: false;
                referencedRelation: "products";
                referencedColumns: ["id"];
            }];
        };
        product_images: {
            Row: {
                alt_text: string | null;
                created_at: string | null;
                display_order: number | null;
                id: string;
                is_primary: boolean | null;
                product_id: string;
                url: string;
            };
            Insert: {
                alt_text?: string | null;
                created_at?: string | null;
                display_order?: number | null;
                id?: string;
                is_primary?: boolean | null;
                product_id: string;
                url: string;
            };
            Update: {
                alt_text?: string | null;
                created_at?: string | null;
                display_order?: number | null;
                id?: string;
                is_primary?: boolean | null;
                product_id?: string;
                url?: string;
            };
            Relationships: [{
                foreignKeyName: "product_images_product_id_fkey";
                columns: ["product_id"];
                isOneToOne: false;
                referencedRelation: "products";
                referencedColumns: ["id"];
            }];
        };
        product_subcategories: {
            Row: {
                created_at: string | null;
                id: string;
                is_primary: boolean | null;
                product_id: string;
                subcategory_id: string;
            };
            Insert: {
                created_at?: string | null;
                id?: string;
                is_primary?: boolean | null;
                product_id: string;
                subcategory_id: string;
            };
            Update: {
                created_at?: string | null;
                id?: string;
                is_primary?: boolean | null;
                product_id?: string;
                subcategory_id?: string;
            };
            Relationships: [{
                foreignKeyName: "product_subcategories_product_id_fkey";
                columns: ["product_id"];
                isOneToOne: false;
                referencedRelation: "products";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "product_subcategories_subcategory_id_fkey";
                columns: ["subcategory_id"];
                isOneToOne: false;
                referencedRelation: "subcategories";
                referencedColumns: ["id"];
            }];
        };
        product_tags: {
            Row: {
                created_at: string | null;
                id: string;
                product_id: string;
                tag_id: string;
            };
            Insert: {
                created_at?: string | null;
                id?: string;
                product_id: string;
                tag_id: string;
            };
            Update: {
                created_at?: string | null;
                id?: string;
                product_id?: string;
                tag_id?: string;
            };
            Relationships: [{
                foreignKeyName: "product_tags_product_id_fkey";
                columns: ["product_id"];
                isOneToOne: false;
                referencedRelation: "products";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "product_tags_tag_id_fkey";
                columns: ["tag_id"];
                isOneToOne: false;
                referencedRelation: "tags";
                referencedColumns: ["id"];
            }];
        };
        products: {
            Row: {
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
            };
            Insert: {
                activo?: boolean | null;
                brand_id?: string | null;
                color_id?: string | null;
                created_at?: string | null;
                descripcion?: string | null;
                destacado?: boolean | null;
                disponible?: boolean | null;
                en_oferta?: boolean | null;
                fecha_actualizacion?: string | null;
                fecha_creacion?: string | null;
                id?: string;
                material_id?: string | null;
                medidas?: string | null;
                metros_por_caja?: number | null;
                moneda?: string | null;
                nombre: string;
                nuevo?: boolean | null;
                pei?: string | null;
                precio: number;
                precio_anterior?: number | null;
                precio_metro?: number | null;
                sku: string;
                slug: string;
                stock?: number | null;
                unidad?: string | null;
                updated_at?: string | null;
            };
            Update: {
                activo?: boolean | null;
                brand_id?: string | null;
                color_id?: string | null;
                created_at?: string | null;
                descripcion?: string | null;
                destacado?: boolean | null;
                disponible?: boolean | null;
                en_oferta?: boolean | null;
                fecha_actualizacion?: string | null;
                fecha_creacion?: string | null;
                id?: string;
                material_id?: string | null;
                medidas?: string | null;
                metros_por_caja?: number | null;
                moneda?: string | null;
                nombre?: string;
                nuevo?: boolean | null;
                pei?: string | null;
                precio?: number;
                precio_anterior?: number | null;
                precio_metro?: number | null;
                sku?: string;
                slug?: string;
                stock?: number | null;
                unidad?: string | null;
                updated_at?: string | null;
            };
            Relationships: [{
                foreignKeyName: "products_brand_id_fkey";
                columns: ["brand_id"];
                isOneToOne: false;
                referencedRelation: "brands";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "products_color_id_fkey";
                columns: ["color_id"];
                isOneToOne: false;
                referencedRelation: "colors";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "products_material_id_fkey";
                columns: ["material_id"];
                isOneToOne: false;
                referencedRelation: "materials";
                referencedColumns: ["id"];
            }];
        };
        subcategories: {
            Row: {
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
            };
            Insert: {
                category_id: string;
                created_at?: string | null;
                description?: string | null;
                display_order?: number | null;
                id?: string;
                image_url?: string | null;
                is_active?: boolean | null;
                name: string;
                slug: string;
                updated_at?: string | null;
            };
            Update: {
                category_id?: string;
                created_at?: string | null;
                description?: string | null;
                display_order?: number | null;
                id?: string;
                image_url?: string | null;
                is_active?: boolean | null;
                name?: string;
                slug?: string;
                updated_at?: string | null;
            };
            Relationships: [{
                foreignKeyName: "subcategories_category_id_fkey";
                columns: ["category_id"];
                isOneToOne: false;
                referencedRelation: "categories";
                referencedColumns: ["id"];
            }];
        };
        tags: {
            Row: {
                created_at: string | null;
                id: string;
                name: string;
                slug: string;
            };
            Insert: {
                created_at?: string | null;
                id?: string;
                name: string;
                slug: string;
            };
            Update: {
                created_at?: string | null;
                id?: string;
                name?: string;
                slug?: string;
            };
            Relationships: [];
        };
    };
    Views: { [_ in never]: never; };
    Functions: { [_ in never]: never; };
    Enums: { [_ in never]: never; };
    CompositeTypes: { [_ in never]: never; };
}, {
    PostgrestVersion: "13.0.5";
}>;
