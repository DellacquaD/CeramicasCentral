import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

// type Brand = Database['public']['Tables']['brands']['Row']
type BrandInsert = Database['public']['Tables']['brands']['Insert']
type BrandUpdate = Database['public']['Tables']['brands']['Update']

// type Category = Database['public']['Tables']['categories']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']
type CategoryUpdate = Database['public']['Tables']['categories']['Update']

// type Subcategory = Database['public']['Tables']['subcategories']['Row']
type SubcategoryInsert = Database['public']['Tables']['subcategories']['Insert']
type SubcategoryUpdate = Database['public']['Tables']['subcategories']['Update']

// type Color = Database['public']['Tables']['colors']['Row']
type ColorInsert = Database['public']['Tables']['colors']['Insert']
type ColorUpdate = Database['public']['Tables']['colors']['Update']

// type Material = Database['public']['Tables']['materials']['Row']
type MaterialInsert = Database['public']['Tables']['materials']['Insert']
type MaterialUpdate = Database['public']['Tables']['materials']['Update']

// type Tag = Database['public']['Tables']['tags']['Row']
type TagInsert = Database['public']['Tables']['tags']['Insert']
type TagUpdate = Database['public']['Tables']['tags']['Update']

// type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

export const useAdminStore = defineStore('admin', () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    // ==================== BRANDS ====================
    const getBrands = async () => {
        const { data, error: err } = await supabase
            .from('brands')
            .select('*')
            .order('name')

        if (err) throw err
        return data
    }

    const createBrand = async (brand: BrandInsert) => {
        const { data, error: err } = await supabase
            .from('brands')
            .insert(brand)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateBrand = async (id: string, brand: BrandUpdate) => {
        const { data, error: err } = await supabase
            .from('brands')
            .update(brand)
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const deleteBrand = async (id: string) => {
        const { error: err } = await supabase
            .from('brands')
            .delete()
            .eq('id', id)

        if (err) throw err
    }

    // ==================== CATEGORIES ====================
    const getCategories = async () => {
        const { data, error: err } = await supabase
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true, nullsFirst: false })

        if (err) throw err
        return data
    }

    const createCategory = async (category: CategoryInsert) => {
        const { data, error: err } = await supabase
            .from('categories')
            .insert(category)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateCategory = async (id: string, category: CategoryUpdate) => {
        const { data, error: err } = await supabase
            .from('categories')
            .update(category)
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const deleteCategory = async (id: string) => {
        const { error: err } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)

        if (err) throw err
    }

    // ==================== SUBCATEGORIES ====================
    const getSubcategories = async () => {
        const { data, error: err } = await supabase
            .from('subcategories')
            .select(`
                *,
                category:categories(id, name)
            `)
            .order('display_order', { ascending: true, nullsFirst: false })

        if (err) throw err
        return data
    }

    const createSubcategory = async (subcategory: SubcategoryInsert) => {
        const { data, error: err } = await supabase
            .from('subcategories')
            .insert(subcategory)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateSubcategory = async (id: string, subcategory: SubcategoryUpdate) => {
        const { data, error: err } = await supabase
            .from('subcategories')
            .update(subcategory)
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const deleteSubcategory = async (id: string) => {
        const { error: err } = await supabase
            .from('subcategories')
            .delete()
            .eq('id', id)

        if (err) throw err
    }

    // ==================== COLORS ====================
    const getColors = async () => {
        const { data, error: err } = await supabase
            .from('colors')
            .select('*')
            .order('name')

        if (err) throw err
        return data
    }

    const createColor = async (color: ColorInsert) => {
        const { data, error: err } = await supabase
            .from('colors')
            .insert(color)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateColor = async (id: string, color: ColorUpdate) => {
        const { data, error: err } = await supabase
            .from('colors')
            .update(color)
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const deleteColor = async (id: string) => {
        const { error: err } = await supabase
            .from('colors')
            .delete()
            .eq('id', id)

        if (err) throw err
    }

    // ==================== MATERIALS ====================
    const getMaterials = async () => {
        const { data, error: err } = await supabase
            .from('materials')
            .select('*')
            .order('name')

        if (err) throw err
        return data
    }

    const createMaterial = async (material: MaterialInsert) => {
        const { data, error: err } = await supabase
            .from('materials')
            .insert(material)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateMaterial = async (id: string, material: MaterialUpdate) => {
        const { data, error: err } = await supabase
            .from('materials')
            .update(material)
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const deleteMaterial = async (id: string) => {
        const { error: err } = await supabase
            .from('materials')
            .delete()
            .eq('id', id)

        if (err) throw err
    }

    // ==================== TAGS ====================
    const getTags = async () => {
        const { data, error: err } = await supabase
            .from('tags')
            .select('*')
            .order('name')

        if (err) throw err
        return data
    }

    const createTag = async (tag: TagInsert) => {
        const { data, error: err } = await supabase
            .from('tags')
            .insert(tag)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateTag = async (id: string, tag: TagUpdate) => {
        const { data, error: err } = await supabase
            .from('tags')
            .update(tag)
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const deleteTag = async (id: string) => {
        const { error: err } = await supabase
            .from('tags')
            .delete()
            .eq('id', id)

        if (err) throw err
    }

    // ==================== PRODUCTS ====================
    const getProducts = async () => {
        const { data, error: err } = await supabase
            .from('products')
            .select(`
                *,
                brand:brands(id, name),
                color:colors(id, name),
                material:materials(id, name),
                images:product_images(*),
                product_categories(
                    category:categories(id, name)
                ),
                product_subcategories(
                    subcategory:subcategories(id, name)
                ),
                product_tags(
                    tag:tags(id, name)
                )
            `)
            .order('created_at', { ascending: false })

        if (err) throw err
        return data
    }

    const createProduct = async (product: ProductInsert) => {
        const { data, error: err } = await supabase
            .from('products')
            .insert(product)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateProduct = async (id: string, product: ProductUpdate) => {
        const { data, error: err } = await supabase
            .from('products')
            .update(product)
            .eq('id', id)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const deleteProduct = async (id: string) => {
        // Primero eliminar las relaciones
        await supabase.from('product_categories').delete().eq('product_id', id)
        await supabase.from('product_subcategories').delete().eq('product_id', id)
        await supabase.from('product_tags').delete().eq('product_id', id)
        await supabase.from('product_images').delete().eq('product_id', id)

        // Luego eliminar el producto
        const { error: err } = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (err) throw err
    }

    // ==================== PRODUCT RELATIONS ====================
    const addProductCategory = async (productId: string, categoryId: string) => {
        const { error: err } = await supabase
            .from('product_categories')
            .insert({ product_id: productId, category_id: categoryId })

        if (err) throw err
    }

    const removeProductCategory = async (productId: string, categoryId: string) => {
        const { error: err } = await supabase
            .from('product_categories')
            .delete()
            .eq('product_id', productId)
            .eq('category_id', categoryId)

        if (err) throw err
    }

    const addProductSubcategory = async (productId: string, subcategoryId: string, isPrimary: boolean = false) => {
        const { error: err } = await supabase
            .from('product_subcategories')
            .insert({
                product_id: productId,
                subcategory_id: subcategoryId,
                is_primary: isPrimary
            })

        if (err) throw err
    }

    const removeProductSubcategory = async (productId: string, subcategoryId: string) => {
        const { error: err } = await supabase
            .from('product_subcategories')
            .delete()
            .eq('product_id', productId)
            .eq('subcategory_id', subcategoryId)

        if (err) throw err
    }

    const addProductTag = async (productId: string, tagId: string) => {
        const { error: err } = await supabase
            .from('product_tags')
            .insert({ product_id: productId, tag_id: tagId })

        if (err) throw err
    }

    const removeProductTag = async (productId: string, tagId: string) => {
        const { error: err } = await supabase
            .from('product_tags')
            .delete()
            .eq('product_id', productId)
            .eq('tag_id', tagId)

        if (err) throw err
    }

    // ==================== PRODUCT IMAGES ====================
    const addProductImage = async (productId: string, url: string, altText?: string, isPrimary: boolean = false, displayOrder?: number) => {
        const { data, error: err } = await supabase
            .from('product_images')
            .insert({
                product_id: productId,
                url,
                alt_text: altText,
                is_primary: isPrimary,
                display_order: displayOrder
            })
            .select()
            .single()

        if (err) throw err
        return data
    }

    const updateProductImage = async (imageId: string, updates: { url?: string, alt_text?: string, is_primary?: boolean, display_order?: number }) => {
        const { data, error: err } = await supabase
            .from('product_images')
            .update(updates)
            .eq('id', imageId)
            .select()
            .single()

        if (err) throw err
        return data
    }

    const deleteProductImage = async (imageId: string) => {
        const { error: err } = await supabase
            .from('product_images')
            .delete()
            .eq('id', imageId)

        if (err) throw err
    }

    return {
        loading,
        error,

        // Brands
        getBrands,
        createBrand,
        updateBrand,
        deleteBrand,

        // Categories
        getCategories,
        createCategory,
        updateCategory,
        deleteCategory,

        // Subcategories
        getSubcategories,
        createSubcategory,
        updateSubcategory,
        deleteSubcategory,

        // Colors
        getColors,
        createColor,
        updateColor,
        deleteColor,

        // Materials
        getMaterials,
        createMaterial,
        updateMaterial,
        deleteMaterial,

        // Tags
        getTags,
        createTag,
        updateTag,
        deleteTag,

        // Products
        getProducts,
        createProduct,
        updateProduct,
        deleteProduct,

        // Product Relations
        addProductCategory,
        removeProductCategory,
        addProductSubcategory,
        removeProductSubcategory,
        addProductTag,
        removeProductTag,

        // Product Images
        addProductImage,
        updateProductImage,
        deleteProductImage
    }
})