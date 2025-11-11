import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
export const useAdminStore = defineStore('admin', () => {
    const loading = ref(false);
    const error = ref(null);
    // ==================== BRANDS ====================
    const getBrands = async () => {
        const { data, error: err } = await supabase
            .from('brands')
            .select('*')
            .order('name');
        if (err)
            throw err;
        return data;
    };
    const createBrand = async (brand) => {
        const { data, error: err } = await supabase
            .from('brands')
            .insert(brand)
            .select()
            .single();
        if (err)
            throw err;
        return data;
    };
    const updateBrand = async (id, brand) => {
        const { data, error: err } = await supabase
            .from('brands')
            .update(brand)
            .eq('id', id)
            .select()
            .single();
        if (err)
            throw err;
        return data;
    };
    const deleteBrand = async (id) => {
        const { error: err } = await supabase
            .from('brands')
            .delete()
            .eq('id', id);
        if (err)
            throw err;
    };
    // ==================== CATEGORIES ====================
    const getCategories = async () => {
        const { data, error: err } = await supabase
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true, nullsFirst: false });
        if (err)
            throw err;
        return data;
    };
    const createCategory = async (category) => {
        const { data, error: err } = await supabase
            .from('categories')
            .insert(category)
            .select()
            .single();
        if (err)
            throw err;
        return data;
    };
    const updateCategory = async (id, category) => {
        const { data, error: err } = await supabase
            .from('categories')
            .update(category)
            .eq('id', id)
            .select()
            .single();
        if (err)
            throw err;
        return data;
    };
    const deleteCategory = async (id) => {
        const { error: err } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);
        if (err)
            throw err;
    };
    // ==================== SUBCATEGORIES ====================
    const getSubcategories = async () => {
        const { data, error: err } = await supabase
            .from('subcategories')
            .select(`
                *,
                category:categories(id, name)
            `)
            .order('display_order', { ascending: true, nullsFirst: false });
        if (err)
            throw err;
        return data;
    };
    const createSubcategory = async (subcategory) => {
        const { data, error: err } = await supabase
            .from('subcategories')
            .insert(subcategory)
            .select()
            .single();
        if (err)
            throw err;
        return data;
    };
    const updateSubcategory = async (id, subcategory) => {
        const { data, error: err } = await supabase
            .from('subcategories')
            .update(subcategory)
            .eq('id', id)
            .select()
            .single();
        if (err)
            throw err;
        return data;
    };
    const deleteSubcategory = async (id) => {
        const { error: err } = await supabase
            .from('subcategories')
            .delete()
            .eq('id', id);
        if (err)
            throw err;
    };
    // ==================== COLORS ====================
    const getColors = async () => {
        const { data, error: err } = await supabase
            .from('colors')
            .select('*')
            .order('name');
        if (err)
            throw err;
        return data;
    };
    const createColor = async (color) => {
        const { data, error: err } = await supabase
            .from('colors')
            .insert(color)
            .select()
            .single();
        if (err)
            throw err;
        return data;
    };
    const updateColor = async (id, color) => {
        const { data, error: err } = await supabase
            .from('colors')
            .update(color)
            .eq('id', id)
            .select()
            .single();
        if (err)
            throw err;
        return data;
    };
    const deleteColor = async (id) => {
        const { error: err } = await supabase
            .from('colors')
            .delete()
            .eq('id', id);
        if (err)
            throw err;
    };
    // ==================== MATERIALS ====================
    const getMaterials = async () => {
        const { data, error: err } = await supabase
            .from('materials')
            .select('*')
            .order('name');
        if (err)
            throw err;
        return data;
    };
    const createMaterial = async (material) => {
        const { data, error: err } = await supabase
            .from('materials')
            .insert(material)
            .select()
            .single();
        if (err)
            throw err;
        return data;
    };
    const updateMaterial = async (id, material) => {
        const { data, error: err } = await supabase
            .from('materials')
            .update(material)
            .eq('id', id)
            .select()
            .single();
        if (err)
            throw err;
        return data;
    };
    const deleteMaterial = async (id) => {
        const { error: err } = await supabase
            .from('materials')
            .delete()
            .eq('id', id);
        if (err)
            throw err;
    };
    // ==================== TAGS ====================
    const getTags = async () => {
        const { data, error: err } = await supabase
            .from('tags')
            .select('*')
            .order('name');
        if (err)
            throw err;
        return data;
    };
    const createTag = async (tag) => {
        const { data, error: err } = await supabase
            .from('tags')
            .insert(tag)
            .select()
            .single();
        if (err)
            throw err;
        return data;
    };
    const updateTag = async (id, tag) => {
        const { data, error: err } = await supabase
            .from('tags')
            .update(tag)
            .eq('id', id)
            .select()
            .single();
        if (err)
            throw err;
        return data;
    };
    const deleteTag = async (id) => {
        const { error: err } = await supabase
            .from('tags')
            .delete()
            .eq('id', id);
        if (err)
            throw err;
    };
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
            .order('created_at', { ascending: false });
        if (err)
            throw err;
        return data;
    };
    const createProduct = async (product) => {
        const { data, error: err } = await supabase
            .from('products')
            .insert(product)
            .select()
            .single();
        if (err)
            throw err;
        return data;
    };
    const updateProduct = async (id, product) => {
        const { data, error: err } = await supabase
            .from('products')
            .update(product)
            .eq('id', id)
            .select()
            .single();
        if (err)
            throw err;
        return data;
    };
    const deleteProduct = async (id) => {
        // Primero eliminar las relaciones
        await supabase.from('product_categories').delete().eq('product_id', id);
        await supabase.from('product_subcategories').delete().eq('product_id', id);
        await supabase.from('product_tags').delete().eq('product_id', id);
        await supabase.from('product_images').delete().eq('product_id', id);
        // Luego eliminar el producto
        const { error: err } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (err)
            throw err;
    };
    // ==================== PRODUCT RELATIONS ====================
    const addProductCategory = async (productId, categoryId) => {
        const { error: err } = await supabase
            .from('product_categories')
            .insert({ product_id: productId, category_id: categoryId });
        if (err)
            throw err;
    };
    const removeProductCategory = async (productId, categoryId) => {
        const { error: err } = await supabase
            .from('product_categories')
            .delete()
            .eq('product_id', productId)
            .eq('category_id', categoryId);
        if (err)
            throw err;
    };
    const addProductSubcategory = async (productId, subcategoryId, isPrimary = false) => {
        const { error: err } = await supabase
            .from('product_subcategories')
            .insert({
            product_id: productId,
            subcategory_id: subcategoryId,
            is_primary: isPrimary
        });
        if (err)
            throw err;
    };
    const removeProductSubcategory = async (productId, subcategoryId) => {
        const { error: err } = await supabase
            .from('product_subcategories')
            .delete()
            .eq('product_id', productId)
            .eq('subcategory_id', subcategoryId);
        if (err)
            throw err;
    };
    const addProductTag = async (productId, tagId) => {
        const { error: err } = await supabase
            .from('product_tags')
            .insert({ product_id: productId, tag_id: tagId });
        if (err)
            throw err;
    };
    const removeProductTag = async (productId, tagId) => {
        const { error: err } = await supabase
            .from('product_tags')
            .delete()
            .eq('product_id', productId)
            .eq('tag_id', tagId);
        if (err)
            throw err;
    };
    // ==================== PRODUCT IMAGES ====================
    const addProductImage = async (productId, url, altText, isPrimary = false, displayOrder) => {
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
            .single();
        if (err)
            throw err;
        return data;
    };
    const updateProductImage = async (imageId, updates) => {
        const { data, error: err } = await supabase
            .from('product_images')
            .update(updates)
            .eq('id', imageId)
            .select()
            .single();
        if (err)
            throw err;
        return data;
    };
    const deleteProductImage = async (imageId) => {
        const { error: err } = await supabase
            .from('product_images')
            .delete()
            .eq('id', imageId);
        if (err)
            throw err;
    };
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
    };
});
