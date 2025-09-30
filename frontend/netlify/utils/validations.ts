import type { CategoriesData, Category, SubCategory } from '../types/categories';

export function isValidSubcategoria(obj: any): obj is SubCategory {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'number' &&
    typeof obj.nombre === 'string' &&
    typeof obj.descripcion === 'string' &&
    (obj.valores === undefined || Array.isArray(obj.valores))
  );
}

export function isValidCategoria(obj: any): obj is Category {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.nombre === 'string' &&
    Array.isArray(obj.subcategoria) &&
    obj.subcategoria.every(isValidSubcategoria)
  );
}

export function isValidCategoriasData(obj: any): obj is CategoriesData {
  if (!obj || typeof obj !== 'object' || !obj.categorias) {
    return false;
  }

  return Object.values(obj.categorias).every(isValidCategoria);
}